import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { creditWallet, reverseCommission } from "@/lib/referral";

const REFUND_ELIGIBLE_STATUSES = ["PAID", "PROCESSING", "AWAITING_RETRY", "COMPLETED"] as const;

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const { orderId, reason, refund } = await req.json();
  if (!orderId) return NextResponse.json({ success: false, message: "orderId wajib diisi." }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });

  const refunded =
    refund === true &&
    (await prisma.$transaction(async (tx) => {
      // Claim the refund atomically so a double click or two admins can't credit twice.
      const claimed = await tx.order.updateMany({
        where: { id: orderId, refundedAt: null, status: { in: [...REFUND_ELIGIBLE_STATUSES] } },
        data: { status: "REJECTED", paymentNote: reason ?? order.paymentNote, refundedAt: new Date() },
      });
      if (claimed.count === 0) return false;

      // Money paid from the referral wallet goes back there; everything else to the main balance.
      const wallet = order.paymentMethod === "REFERRAL_BALANCE" ? "REFERRAL" : "MAIN";
      const balanceAfter = await creditWallet(tx, order.userId, wallet, order.sellPrice);

      await tx.balanceTransaction.create({
        data: {
          userId: order.userId,
          wallet,
          type: "REFUND",
          amount: order.sellPrice,
          balanceAfter,
          orderId: order.id,
          note: reason ?? null,
        },
      });
      await reverseCommission(tx, order.id);
      return true;
    }));

  if (refunded) {
    return NextResponse.json({ success: true, message: "Order ditolak dan saldo dikembalikan." });
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: "REJECTED", paymentNote: reason ?? order.paymentNote },
    });
    await reverseCommission(tx, orderId);
  });

  return NextResponse.json({ success: true, message: "Order ditolak." });
}
