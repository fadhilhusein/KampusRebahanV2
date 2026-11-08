import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { creditWallet, reverseCommission } from "@/lib/referral";
import { settleLoyaltyOnReject } from "@/lib/loyalty";
import type { Prisma } from "@/lib/generated/prisma";
import { REFUND_ELIGIBLE_STATUSES, formulaRefund, previewRefund, type RefundOptions } from "@/lib/refundPreview";

/** Optional issue date (YYYY-MM-DD, counted as midday WIB) and warranty override from the admin. */
function parseOptions(date: unknown, warranty: unknown): RefundOptions | string {
  const opts: RefundOptions = {};
  if (date) {
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Format tanggal kendala tidak valid.";
    const at = new Date(`${date}T12:00:00+07:00`);
    if (isNaN(at.getTime())) return "Format tanggal kendala tidak valid.";
    opts.issueAt = new Date(Math.min(at.getTime(), Date.now()));
  }
  if (warranty !== undefined && warranty !== null && warranty !== "") {
    const days = Number(warranty);
    if (!Number.isInteger(days) || days < 0 || days > 3650) return "Masa garansi harus 0–3650 hari.";
    opts.warrantyDays = days || null;
  }
  return opts;
}

/** Dry run: what a refund of this order would do (wallet, deductions, coupon, commission). */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ success: false, message: "orderId wajib diisi." }, { status: 400 });

  const opts = parseOptions(req.nextUrl.searchParams.get("date"), req.nextUrl.searchParams.get("warranty"));
  if (typeof opts === "string") return NextResponse.json({ success: false, message: opts }, { status: 400 });

  const preview = await previewRefund(orderId, opts);
  if (!preview) return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ success: true, data: preview });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const { orderId, reason, refund, date, warranty, method } = await req.json();
  // BALANCE credits the customer's wallet; MANUAL records a refund the admin already paid out (e-wallet / bank).
  const refundMethod = method === "MANUAL" ? "MANUAL" : "BALANCE";
  if (!orderId) return NextResponse.json({ success: false, message: "orderId wajib diisi." }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });

  // Refund amount follows S&K section 6: price × remaining/warranty × 90% − operational fee.
  let formulaAmount = 0;
  if (refund === true) {
    const opts = parseOptions(date, warranty);
    if (typeof opts === "string") return NextResponse.json({ success: false, message: opts }, { status: 400 });
    const { result } = await formulaRefund(order, opts);
    if (!result.eligible || result.amount <= 0) {
      return NextResponse.json(
        { success: false, message: result.eligible ? "Nominal refund setelah biaya operasional Rp0." : result.reason },
        { status: 409 }
      );
    }
    formulaAmount = result.amount;
  }

  // The free reward order itself never affects loyalty.
  const settleLoyalty = (tx: Prisma.TransactionClient, refundAmount: number) =>
    order.paymentMethod === "COUPON" ? Promise.resolve(0) : settleLoyaltyOnReject(tx, order.userId, refundAmount);

  const refunded =
    refund === true &&
    (await prisma.$transaction(async (tx) => {
      // Claim the refund atomically so a double click or two admins can't credit twice.
      const claimed = await tx.order.updateMany({
        where: { id: orderId, refundedAt: null, status: { in: [...REFUND_ELIGIBLE_STATUSES] } },
        data: { status: "REJECTED", paymentNote: reason ?? order.paymentNote, refundedAt: new Date(), refundMethod },
      });
      if (claimed.count === 0) return null;

      // If this refund drops the customer below the loyalty threshold after they redeemed the
      // reward, its cost is withheld (once); an unredeemed coupon is revoked.
      const withheld = await settleLoyalty(tx, formulaAmount);
      const refundAmount = Math.max(0, formulaAmount - withheld);
      await tx.order.update({ where: { id: order.id }, data: { refundAmount } });
      await reverseCommission(tx, order.id);
      if (refundMethod === "MANUAL") return { refundAmount, withheld };

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
      return { refundAmount, withheld };
    }));

  if (refunded) {
    const rp = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
    return NextResponse.json({
      success: true,
      message:
        (refundMethod === "MANUAL"
          ? `Order ditolak. Refund manual ${rp(refunded.refundAmount)} tercatat, saldo user tidak berubah.`
          : `Order ditolak. Refund ${rp(refunded.refundAmount)} dikembalikan ke saldo.`) +
        (refunded.withheld ? ` Sudah dipotong ${rp(refunded.withheld)} karena kupon Gemini AI Pro sudah ditukar.` : ""),
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
