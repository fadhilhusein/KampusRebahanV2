import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PAYOUT_METHODS, debitWallet, getSessionUserId } from "@/lib/referral";
import { getReferralMinPayout } from "@/lib/settings";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const limited = await rateLimit(`payout:user:${userId}`, 3, 3600);
  if (!limited.ok) return tooManyRequests(limited.retryAfter);

  const body = await req.json().catch(() => ({}));
  const amount = Number(body.amount);
  const method = String(body.method ?? "");
  const accountNumber = String(body.accountNumber ?? "").trim();
  const accountName = String(body.accountName ?? "").trim();
  const minPayout = await getReferralMinPayout();

  if (!(PAYOUT_METHODS as readonly string[]).includes(method)) {
    return NextResponse.json({ success: false, message: "Metode pencairan tidak valid." }, { status: 400 });
  }
  if (!/^[0-9 \-]{6,30}$/.test(accountNumber)) {
    return NextResponse.json({ success: false, message: "Nomor akun tidak valid." }, { status: 400 });
  }
  if (accountName.length < 2 || accountName.length > 80) {
    return NextResponse.json({ success: false, message: "Nama pemilik wajib diisi (2–80 karakter)." }, { status: 400 });
  }
  if (!Number.isInteger(amount) || amount < minPayout || amount > 100_000_000) {
    return NextResponse.json(
      { success: false, message: `Nominal minimal Rp${minPayout.toLocaleString("id-ID")}.` },
      { status: 400 }
    );
  }

  const payout = await prisma.$transaction(async (tx) => {
    const balanceAfter = await debitWallet(tx, userId, "REFERRAL", amount);
    if (balanceAfter === null) return null;

    const created = await tx.payoutRequest.create({ data: { userId, amount, method, accountNumber, accountName } });
    await tx.balanceTransaction.create({
      data: { userId, wallet: "REFERRAL", type: "PAYOUT", amount: -amount, balanceAfter, note: created.id },
    });
    return created;
  });

  if (!payout) return NextResponse.json({ success: false, message: "Saldo referensi tidak mencukupi." }, { status: 400 });
  return NextResponse.json({ success: true, data: payout });
}
