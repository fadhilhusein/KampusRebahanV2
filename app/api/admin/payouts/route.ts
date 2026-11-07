import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { creditWallet } from "@/lib/referral";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const payouts = await prisma.payoutRequest.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });
  return NextResponse.json({ success: true, data: payouts });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const { id, action, note } = await req.json().catch(() => ({}));
  if (typeof id !== "string" || (action !== "PAID" && action !== "REJECTED")) {
    return NextResponse.json({ success: false, message: "Permintaan tidak valid." }, { status: 400 });
  }
  const adminNote = typeof note === "string" && note.trim() ? note.trim().slice(0, 300) : null;

  const done = await prisma.$transaction(async (tx) => {
    // Claim the PENDING request so two admins (or a double click) can't process it twice.
    const claimed = await tx.payoutRequest.updateMany({
      where: { id, status: "PENDING" },
      data: { status: action, adminNote, processedAt: new Date() },
    });
    if (claimed.count === 0) return false;

    if (action === "REJECTED") {
      const payout = await tx.payoutRequest.findUniqueOrThrow({ where: { id } });
      const balanceAfter = await creditWallet(tx, payout.userId, "REFERRAL", payout.amount);
      await tx.balanceTransaction.create({
        data: {
          userId: payout.userId,
          wallet: "REFERRAL",
          type: "PAYOUT_REVERSAL",
          amount: payout.amount,
          balanceAfter,
          note: adminNote ?? payout.id,
        },
      });
    }
    return true;
  });

  if (!done) return NextResponse.json({ success: false, message: "Permintaan sudah diproses." }, { status: 409 });
  return NextResponse.json({
    success: true,
    message: action === "PAID" ? "Pencairan ditandai dibayar." : "Pencairan ditolak, saldo dikembalikan.",
  });
}
