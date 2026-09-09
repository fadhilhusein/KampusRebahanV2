import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

const REFUND_ELIGIBLE_STATUSES = ["PAID", "PROCESSING", "AWAITING_RETRY", "COMPLETED"];

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const { orderId, reason, refund } = await req.json();
  if (!orderId) return NextResponse.json({ success: false, message: "orderId wajib diisi." }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });

  const shouldRefund =
    refund === true &&
    order.refundedAt === null &&
    REFUND_ELIGIBLE_STATUSES.includes(order.status);

  if (shouldRefund) {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: "REJECTED", paymentNote: reason ?? order.paymentNote, refundedAt: new Date() },
      });

      const updatedUser = await tx.user.update({
        where: { id: order.userId },
        data: { balance: { increment: order.sellPrice } },
      });

      await tx.balanceTransaction.create({
        data: {
          userId: order.userId,
          type: "REFUND",
          amount: order.sellPrice,
          balanceAfter: updatedUser.balance,
          orderId: order.id,
          note: reason ?? null,
        },
      });
    });

    return NextResponse.json({ success: true, message: "Order ditolak dan saldo dikembalikan." });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "REJECTED", paymentNote: reason ?? order.paymentNote },
  });

  return NextResponse.json({ success: true, message: "Order ditolak." });
}
