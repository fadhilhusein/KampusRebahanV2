import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { creditWallet, reverseCommission } from "@/lib/referral";
import { settleLoyaltyOnReject } from "@/lib/loyalty";
import type { Prisma } from "@/lib/generated/prisma";
import { REFUND_ELIGIBLE_STATUSES, previewRefund } from "@/lib/refundPreview";

/** Dry run: what a refund of this order would do (wallet, deductions, coupon, commission). */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ success: false, message: "orderId wajib diisi." }, { status: 400 });

  const preview = await previewRefund(orderId);
  if (!preview) return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ success: true, data: preview });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const { orderId, reason, refund } = await req.json();
  if (!orderId) return NextResponse.json({ success: false, message: "orderId wajib diisi." }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });

  // The free reward order itself never affects loyalty.
  const settleLoyalty = (tx: Prisma.TransactionClient, refundAmount: number) =>
    order.paymentMethod === "COUPON" ? Promise.resolve(0) : settleLoyaltyOnReject(tx, order.userId, refundAmount);

  const refunded =
    refund === true &&
    (await prisma.$transaction(async (tx) => {
      // Claim the refund atomically so a double click or two admins can't credit twice.
      const claimed = await tx.order.updateMany({
        where: { id: orderId, refundedAt: null, status: { in: [...REFUND_ELIGIBLE_STATUSES] } },
        data: { status: "REJECTED", paymentNote: reason ?? order.paymentNote, refundedAt: new Date() },
      });
      if (claimed.count === 0) return null;

      // If this refund drops the customer below the loyalty threshold after they redeemed the
      // reward, its cost is withheld (once); an unredeemed coupon is revoked.
      const withheld = await settleLoyalty(tx, order.sellPrice);
      const refundAmount = order.sellPrice - withheld;

      // Money paid from the referral wallet goes back there; everything else to the main balance.
      const wallet = order.paymentMethod === "REFERRAL_BALANCE" ? "REFERRAL" : "MAIN";
      const balanceAfter = await creditWallet(tx, order.userId, wallet, refundAmount);

      await tx.balanceTransaction.create({
        data: {
          userId: order.userId,
          wallet,
          type: "REFUND",
          amount: refundAmount,
          balanceAfter,
          orderId: order.id,
          note: [reason, withheld ? `Dipotong Rp${withheld.toLocaleString("id-ID")} (hadiah Gemini AI Pro sudah ditukar)` : null, `oleh ${admin.email}`]
            .filter(Boolean)
            .join(" · ") || null,
        },
      });
      await reverseCommission(tx, order.id);
      return { refundAmount, withheld };
    }));

  if (refunded) {
    const rp = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
    return NextResponse.json({
      success: true,
      message: refunded.withheld
        ? `Order ditolak. Refund ${rp(refunded.refundAmount)} (dipotong ${rp(refunded.withheld)} karena kupon Gemini AI Pro sudah ditukar).`
        : "Order ditolak dan saldo dikembalikan.",
    });
  }

  // A refund that couldn't be claimed must not silently turn into a plain reject.
  if (refund === true) {
    return NextResponse.json(
      { success: false, message: order.refundedAt ? "Order ini sudah direfund." : "Status order tidak bisa direfund." },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: "REJECTED", paymentNote: reason ?? order.paymentNote },
    });
    await reverseCommission(tx, orderId);
    await settleLoyalty(tx, 0); // no money back: only revokes an unredeemed coupon
  });

  return NextResponse.json({ success: true, message: "Order ditolak." });
}
