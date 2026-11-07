import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { LOYALTY_REWARD, LOYALTY_THRESHOLD } from "@/lib/loyalty";
import { loyaltyProgress } from "@/lib/loyaltyRules";

const IN_PROGRESS = ["PAID", "PROCESSING", "AWAITING_RETRY"];

/** Per-customer loyalty progress, coupon state and refund effects, for admin monitoring. */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  // shortcut: loads every paid order into memory; move to SQL aggregates if orders reach the tens of thousands.
  const [orders, coupons] = await Promise.all([
    prisma.order.findMany({
      where: { sellPrice: { gt: 0 }, paymentMethod: { not: "COUPON" } },
      select: { userId: true, status: true, sellPrice: true, completedAt: true, refundedAt: true },
    }),
    prisma.coupon.findMany({ where: { reward: LOYALTY_REWARD } }),
  ]);

  const byUser = new Map<string, typeof orders>();
  for (const o of orders) byUser.set(o.userId, [...(byUser.get(o.userId) ?? []), o]);
  const couponByUser = new Map(coupons.map((c) => [c.userId, c]));
  const userIds = [...new Set([...byUser.keys(), ...couponByUser.keys()])];

  const users = await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } });
  const now = Date.now();

  const rows = users.map((u) => {
    const list = byUser.get(u.id) ?? [];
    const completed = list.filter((o) => o.status === "COMPLETED");
    const refunded = list.filter((o) => o.refundedAt);
    const { total, unlockAt } = loyaltyProgress(completed, LOYALTY_THRESHOLD);
    const coupon = couponByUser.get(u.id);
    const lastRefund = refunded.reduce<Date | null>((d, o) => (!d || o.refundedAt! > d ? o.refundedAt : d), null);

    let state: string;
    if (coupon?.status === "REDEEMED") state = "REDEEMED";
    else if (coupon?.status === "ACTIVE") state = "ACTIVE";
    else if (unlockAt && unlockAt.getTime() > now) state = "WAITING";
    else if (unlockAt) state = coupon?.status === "REVOKED" ? "REACTIVATING" : "READY";
    else state = coupon?.status === "REVOKED" ? "REVOKED" : "BELOW";

    return {
      userId: u.id,
      name: u.name,
      email: u.email,
      total,
      inProgress: list.filter((o) => IN_PROGRESS.includes(o.status)).reduce((s, o) => s + o.sellPrice, 0),
      refundedTotal: refunded.reduce((s, o) => s + o.sellPrice, 0),
      refundCount: refunded.length,
      lastRefundAt: lastRefund?.toISOString() ?? null,
      state,
      unlockAt: unlockAt?.toISOString() ?? null,
      couponCode: coupon?.code ?? null,
      redeemedAt: coupon?.redeemedAt?.toISOString() ?? null,
      revokedAt: coupon?.revokedAt?.toISOString() ?? null,
      clawbackAmount: coupon?.clawbackAmount ?? null,
    };
  });

  rows.sort((a, b) => b.total + b.inProgress - (a.total + a.inProgress));
  return NextResponse.json({ success: true, data: { threshold: LOYALTY_THRESHOLD, rows: rows.slice(0, 200) } });
}
