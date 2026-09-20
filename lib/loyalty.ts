import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

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
 * Only COMPLETED orders count, at the price the customer paid; the coupon-funded reward order
 * itself has sellPrice 0 so it never counts. Issues the coupon the first time the threshold is met.
 */
export async function getLoyaltyState(userId: string): Promise<LoyaltyState> {
  const [aggregate, existing] = await Promise.all([
    prisma.order.aggregate({ _sum: { sellPrice: true }, where: { userId, status: "COMPLETED" } }),
    findCoupon(userId),
  ]);

  const total = aggregate._sum.sellPrice ?? 0;
  let coupon = existing;

  if (!coupon && total >= LOYALTY_THRESHOLD) {
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
          status: coupon.status,
          orderId: coupon.orderId,
          redeemedAt: coupon.redeemedAt?.toISOString() ?? null,
        }
      : null,
  };
}
