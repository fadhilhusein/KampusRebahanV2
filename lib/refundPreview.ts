import { prisma } from "@/lib/prisma";
import { LOYALTY_REWARD, LOYALTY_THRESHOLD } from "@/lib/loyalty";
import { rewardDeduction } from "@/lib/loyaltyRules";
import { warungApi } from "@/lib/api";
import { estimateOrderRefund, parseWarrantyDays, type OrderRefundResult } from "@/lib/refundCalc";
import type { Order } from "@/lib/generated/prisma";

/** Warranty of the variant as the supplier lists it now; orders don't store it. */
// The supplier product list takes ~3s; refund previews refetch on every date/warranty edit.
// shortcut: per-instance memory cache, fine for warranty text that rarely changes.
let warrantyCache: { at: number; byVariant: Map<string, string> } | null = null;
const WARRANTY_TTL_MS = 5 * 60_000;

export async function lookupWarranty(variantId: string): Promise<{ text: string; days: number | null } | null> {
  if (!warrantyCache || Date.now() - warrantyCache.at > WARRANTY_TTL_MS) {
    const products = await warungApi.getProducts().catch(() => null);
    if (products?.success) {
      warrantyCache = { at: Date.now(), byVariant: new Map(products.data.flatMap((p) => p.variants).map((v) => [v.id, v.warranty])) };
    }
  }
  const text = warrantyCache?.byVariant.get(variantId);
  return text !== undefined ? { text, days: parseWarrantyDays(text) } : null;
}

export interface RefundOptions {
  /** Day the customer reported the problem; defaults to now. */
  issueAt?: Date;
  /** Admin override when the supplier no longer lists the variant or its warranty is wrong. */
  warrantyDays?: number | null;
}

export interface FormulaRefund {
  warrantyText: string | null;
  warrantyDays: number | null;
  /** False when the supplier no longer lists the variant and no override was given. */
  warrantyKnown: boolean;
  result: OrderRefundResult;
}

/** Refund per S&K section 6, as an admin applies it (no 48h wait for undelivered orders). */
export async function formulaRefund(order: Order, opts: RefundOptions = {}): Promise<FormulaRefund> {
  const now = new Date();
  const looked = opts.warrantyDays === undefined ? await lookupWarranty(order.variantId) : null;
  const warrantyDays = opts.warrantyDays !== undefined ? opts.warrantyDays : (looked?.days ?? null);
  const warrantyKnown = opts.warrantyDays !== undefined || !!looked;
  const result = estimateOrderRefund({
    status: order.status,
    sellPrice: order.sellPrice,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    completedAt: order.completedAt,
    refundedAt: order.refundedAt,
    warrantyDays,
    issueAt: opts.issueAt ?? now,
    now,
    ignoreWait: true,
  });
  // Delivered order whose warranty we can't see: don't guess "no warranty", ask the admin.
  const unknown = !warrantyKnown && order.status === "COMPLETED";
  return {
    warrantyText: opts.warrantyDays !== undefined ? (opts.warrantyDays ? `${opts.warrantyDays} Hari` : "No Garansi") : (looked?.text ?? null),
    warrantyDays,
    warrantyKnown,
    result: unknown ? { eligible: false, reason: "Data garansi produk ini tidak ada lagi di supplier. Isi masa garansi manual." } : result,
  };
}

export const REFUND_ELIGIBLE_STATUSES = ["PAID", "PROCESSING", "AWAITING_RETRY", "COMPLETED"] as const;

export interface RefundPreview {
  orderId: string;
  productName: string;
  variantName: string;
  customer: string;
  status: string;
  sellPrice: number;
  paymentMethod: string;
  refundEligible: boolean;
  /** Why the formula gives no refund, when the status itself would allow one. */
  notEligibleReason: string | null;
  warrantyText: string | null;
  warrantyDays: number | null;
  warrantyKnown: boolean;
  usedDays: number | null;
  remainingDays: number | null;
  /** price × remaining/warranty × 90%, before fees. */
  gross: number;
  opFee: number;
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
export async function previewRefund(orderId: string, opts: RefundOptions = {}): Promise<RefundPreview | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { name: true, email: true } }, commission: { include: { referrer: { select: { referralCode: true } } } } },
  });
  if (!order) return null;

  const isReward = order.paymentMethod === "COUPON";
  const formula = await formulaRefund(order, opts);
  const r = formula.result;
  const statusOk = !order.refundedAt && (REFUND_ELIGIBLE_STATUSES as readonly string[]).includes(order.status);
  const formulaAmount = r.eligible ? r.amount : 0;
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
        refundAmount: formulaAmount,
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
    paymentMethod: order.paymentMethod,
    refundEligible: statusOk && r.eligible && formulaAmount > 0,
    notEligibleReason: !statusOk ? null : !r.eligible ? r.reason : formulaAmount <= 0 ? "Nominal refund setelah biaya operasional Rp0." : null,
    warrantyText: formula.warrantyText,
    warrantyDays: formula.warrantyDays,
    warrantyKnown: formula.warrantyKnown,
    usedDays: r.eligible ? r.usedDays : null,
    remainingDays: r.eligible ? r.remainingDays : null,
    gross: r.eligible ? r.gross : 0,
    opFee: r.eligible ? r.opFee : 0,
    delivered: order.status === "COMPLETED",
    wallet: order.paymentMethod === "REFERRAL_BALANCE" ? "REFERRAL" : "MAIN",
    withheld,
    refundAmount: Math.max(0, formulaAmount - withheld),
    couponEffect,
    commission: credited ? { amount: credited.amount, referrerCode: credited.referrer.referralCode } : null,
    progressBefore,
    progressAfter,
    threshold: LOYALTY_THRESHOLD,
  };
}
