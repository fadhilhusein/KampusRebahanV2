import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma";
import { loyaltyProgress, rewardDeduction } from "@/lib/loyaltyRules";

// Loyalty reward: once a user's completed purchases add up to LOYALTY_THRESHOLD they get one
// coupon (once per user, enforced by the unique [userId, reward] index) that can be redeemed
// for a free Gemini AI Pro membership.
export const LOYALTY_THRESHOLD = 200_000;
export const LOYALTY_REWARD = "GEMINI_PRO";
export const LOYALTY_REWARD_LABEL = "Gemini AI Pro Member";
// warungrebahan variant handed out as the reward ("Gemini AI Antigravity — Pro Member").
export const LOYALTY_REWARD_VARIANT_ID =
  process.env.LOYALTY_REWARD_VARIANT_ID ?? "d5469aa6-5a9f-11f1-94d1-bc241112a182";

export interface LoyaltyCoupon {
  code: string;
  status: "ACTIVE" | "REDEEMED";
  orderId: string | null;
  redeemedAt: string | null;
}

export interface LoyaltyState {
  total: number;
  threshold: number;
  percent: number;
  remaining: number;
  rewardLabel: string;
  coupon: LoyaltyCoupon | null;
  /** Threshold reached but still in the waiting period: when the coupon will be issued. */
  unlockAt: string | null;
}

// Unambiguous alphabet (no 0/O/1/I) so a code can be read out or typed without mistakes.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCouponCode() {
  const bytes = randomBytes(8);
  let code = "";
  for (const byte of bytes) code += CODE_ALPHABET[byte % CODE_ALPHABET.length];
  return `KR-${code}`;
}

function isUniqueViolation(err: unknown) {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002";
}

async function findCoupon(userId: string) {
  return prisma.coupon.findUnique({ where: { userId_reward: { userId, reward: LOYALTY_REWARD } } });
}

/**
 * Progress towards the reward, computed from the DB only (no warungrebahan call).
 * Only COMPLETED orders count (delivered, as reported by the supplier), at the price the customer
 * paid; the coupon-funded reward order itself has sellPrice 0 so it never counts. The coupon is
 * issued once the threshold-crossing order has been delivered for LOYALTY_HOLD_MS.
 */
export async function getLoyaltyState(userId: string): Promise<LoyaltyState> {
  const [orders, existing] = await Promise.all([
    prisma.order.findMany({ where: { userId, status: "COMPLETED" }, select: { sellPrice: true, completedAt: true } }),
    findCoupon(userId),
  ]);

  const { total, unlockAt } = loyaltyProgress(orders, LOYALTY_THRESHOLD);
  const unlocked = unlockAt !== null && unlockAt.getTime() <= Date.now();
  let coupon = existing;

  // A revoked coupon comes back once the customer qualifies again (the unique index keeps one row).
  if (coupon?.status === "REVOKED" && unlocked) {
    await prisma.coupon.updateMany({ where: { id: coupon.id, status: "REVOKED" }, data: { status: "ACTIVE" } });
    coupon = await findCoupon(userId);
  }
  if (coupon?.status === "REVOKED") coupon = null; // invisible to the customer until requalified

  if (!coupon && unlocked) {
    try {
      coupon = await prisma.coupon.create({
        data: { userId, reward: LOYALTY_REWARD, code: generateCouponCode() },
      });
    } catch (err) {
      // Lost a race with a parallel request (or a code collision): the winner's coupon is the one to use.
      if (!isUniqueViolation(err)) throw err;
      coupon = await findCoupon(userId);
    }
  }

  return {
    total,
    threshold: LOYALTY_THRESHOLD,
    percent: Math.min(100, Math.floor((total / LOYALTY_THRESHOLD) * 100)),
    remaining: Math.max(0, LOYALTY_THRESHOLD - total),
    rewardLabel: LOYALTY_REWARD_LABEL,
    coupon: coupon
      ? {
          code: coupon.code,
          status: coupon.status as LoyaltyCoupon["status"],
          orderId: coupon.orderId,
          redeemedAt: coupon.redeemedAt?.toISOString() ?? null,
        }
      : null,
    unlockAt: !coupon && unlockAt && !unlocked ? unlockAt.toISOString() : null,
  };
}

/**
 * Keeps the reward fair when an order is rejected. Call inside the reject transaction, after the
 * order is no longer COMPLETED. If the customer drops below the threshold: an unredeemed coupon is
 * revoked; a redeemed one has its cost withheld from this refund (once). Returns the amount to
 * withhold from `refundAmount`.
 */
export async function settleLoyaltyOnReject(
  tx: Prisma.TransactionClient,
  userId: string,
  refundAmount: number
): Promise<number> {
  const coupon = await tx.coupon.findUnique({ where: { userId_reward: { userId, reward: LOYALTY_REWARD } } });
  if (!coupon) return 0;

  const remaining = await tx.order.aggregate({ _sum: { sellPrice: true }, where: { userId, status: "COMPLETED" } });
  const remainingTotal = remaining._sum.sellPrice ?? 0;
  if (remainingTotal >= LOYALTY_THRESHOLD) return 0;

  if (coupon.status === "REVOKED") return 0;
  if (coupon.status === "ACTIVE") {
    await tx.coupon.updateMany({ where: { id: coupon.id, status: "ACTIVE" }, data: { status: "REVOKED", revokedAt: new Date() } });
    return 0;
  }

  const rewardOrder = coupon.orderId
    ? await tx.order.findUnique({ where: { id: coupon.orderId }, select: { costPrice: true } })
    : null;
  const deduction = rewardDeduction({
    remainingTotal,
    threshold: LOYALTY_THRESHOLD,
    couponRedeemed: true,
    alreadyClawedBack: coupon.clawedBackAt !== null,
    rewardCost: rewardOrder?.costPrice ?? 0,
    refundAmount,
  });
  if (deduction === 0) return 0;

  // Claim the clawback so two refunds can't both withhold it.
  const claimed = await tx.coupon.updateMany({ where: { id: coupon.id, clawedBackAt: null }, data: { clawedBackAt: new Date(), clawbackAmount: deduction } });
  return claimed.count === 1 ? deduction : 0;
}
