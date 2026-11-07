import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { syncSupplierOrders } from "@/lib/supplierSync";

// Statuses that mean the customer's money arrived (refunds end in REJECTED and drop out).
const PAID_STATUSES = ["PAID", "PROCESSING", "AWAITING_RETRY", "COMPLETED"] as const;

/** Start of today in Asia/Jakarta (UTC+7, no DST). */
function startOfJakartaDay(now = new Date()) {
  const offset = 7 * 3600_000;
  const local = new Date(now.getTime() + offset);
  local.setUTCHours(0, 0, 0, 0);
  return new Date(local.getTime() - offset);
}

/** Counts for the admin nav badges and the "Perlu tindakan" list, plus today's numbers. */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  await syncSupplierOrders();
  const since = startOfJakartaDay();

  const [retry, processing, transfer, payouts, today, todayCount, recent] = await Promise.all([
    prisma.order.count({ where: { status: "AWAITING_RETRY" } }),
    prisma.order.count({ where: { status: "PROCESSING" } }),
    prisma.order.count({ where: { status: "PAID", paymentMethod: "BANK_TRANSFER" } }),
    prisma.payoutRequest.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      _sum: { sellPrice: true, costPrice: true },
      where: { createdAt: { gte: since }, status: { in: [...PAID_STATUSES] }, paymentMethod: { not: "COUPON" } },
    }),
    prisma.order.count({ where: { createdAt: { gte: since }, status: { in: [...PAID_STATUSES] } } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, productName: true, variantName: true, sellPrice: true, status: true, refundedAt: true, createdAt: true, user: { select: { email: true } } },
    }),
  ]);

  const revenue = today._sum.sellPrice ?? 0;
  return NextResponse.json({
    success: true,
    data: {
      counts: { retry, processing, transfer, payouts, orders: retry + processing + transfer },
      today: { revenue, profit: revenue - (today._sum.costPrice ?? 0), orders: todayCount },
      recent,
    },
  });
}
