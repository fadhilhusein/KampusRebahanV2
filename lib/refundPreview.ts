import { prisma } from "@/lib/prisma";
import { LOYALTY_REWARD, LOYALTY_THRESHOLD } from "@/lib/loyalty";
import { rewardDeduction } from "@/lib/loyaltyRules";

export const REFUND_ELIGIBLE_STATUSES = ["PAID", "PROCESSING", "AWAITING_RETRY", "COMPLETED"] as const;

export interface RefundPreview {
  orderId: string;
  productName: string;
  variantName: string;
  customer: string;
  status: string;
  sellPrice: number;
  refundEligible: boolean;
  delivered: boolean;
  wallet: "MAIN" | "REFERRAL";
  withheld: number;
  refundAmount: number;
  couponEffect: "REVOKE" | "DEDUCT" | null;
  commission: { amount: number; referrerCode: string | null } | null;
  progressBefore: number;
  progressAfter: number;
  threshold: number;
}

/**
 * Read-only forecast of what /api/admin/reject would do for this order, using the same rules
 * as settleLoyaltyOnReject and reverseCommission, so the admin sees the effects before confirming.
 */
export async function previewRefund(orderId: string): Promise<RefundPreview | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { name: true, email: true } }, commission: { include: { referrer: { select: { referralCode: true } } } } },
  });
  if (!order) return null;

  const isReward = order.paymentMethod === "COUPON";
  const [completed, coupon] = await Promise.all([
    prisma.order.aggregate({ _sum: { sellPrice: true }, where: { userId: order.userId, status: "COMPLETED" } }),
    isReward ? null : prisma.coupon.findUnique({ where: { userId_reward: { userId: order.userId, reward: LOYALTY_REWARD } } }),
  ]);
  const progressBefore = completed._sum.sellPrice ?? 0;
  const progressAfter = progressBefore - (order.status === "COMPLETED" ? order.sellPrice : 0);

  let withheld = 0;
  let couponEffect: RefundPreview["couponEffect"] = null;
  if (coupon && progressAfter < LOYALTY_THRESHOLD) {
    if (coupon.status === "ACTIVE") couponEffect = "REVOKE";
    if (coupon.status === "REDEEMED") {
      const rewardOrder = coupon.orderId ? await prisma.order.findUnique({ where: { id: coupon.orderId }, select: { costPrice: true } }) : null;
      withheld = rewardDeduction({
        remainingTotal: progressAfter,
        threshold: LOYALTY_THRESHOLD,
        couponRedeemed: true,
        alreadyClawedBack: coupon.clawedBackAt !== null,
        rewardCost: rewardOrder?.costPrice ?? 0,
        refundAmount: order.sellPrice,
      });
      if (withheld > 0) couponEffect = "DEDUCT";
    }
  }

  const credited = order.commission?.status === "CREDITED" ? order.commission : null;
  return {
    orderId: order.id,
    productName: order.productName,
    variantName: order.variantName,
    customer: order.user.name ?? order.user.email,
    status: order.status,
    sellPrice: order.sellPrice,
    refundEligible: !order.refundedAt && (REFUND_ELIGIBLE_STATUSES as readonly string[]).includes(order.status),
    delivered: order.status === "COMPLETED",
    wallet: order.paymentMethod === "REFERRAL_BALANCE" ? "REFERRAL" : "MAIN",
    withheld,
    refundAmount: order.sellPrice - withheld,
    couponEffect,
    commission: credited ? { amount: credited.amount, referrerCode: credited.referrer.referralCode } : null,
    progressBefore,
    progressAfter,
    threshold: LOYALTY_THRESHOLD,
  };
}
