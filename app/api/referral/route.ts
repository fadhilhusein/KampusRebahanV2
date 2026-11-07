import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReferralCode, getSessionUserId, isUniqueViolation } from "@/lib/referral";
import { getReferralCommissionPercent, getReferralMinPayout } from "@/lib/settings";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const [user, orders, earned, commissions, payouts, percent, minPayout] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true, referralBalance: true, referralClicks: true } }),
    prisma.order.count({ where: { referrerId: userId, status: "COMPLETED" } }),
    prisma.referralCommission.aggregate({ where: { referrerId: userId, status: "CREDITED" }, _sum: { amount: true } }),
    prisma.referralCommission.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, amount: true, status: true, createdAt: true, order: { select: { productName: true, variantName: true } } },
    }),
    prisma.payoutRequest.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    getReferralCommissionPercent(),
    getReferralMinPayout(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      code: user?.referralCode ?? null,
      balance: user?.referralBalance ?? 0,
      clicks: user?.referralClicks ?? 0,
      orders,
      totalEarned: earned._sum.amount ?? 0,
      commissions,
      payouts,
      percent,
      minPayout,
    },
  });
}

/** Joins the program. Idempotent: returns the existing code if there is one. */
export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      // Only fills the code when it's still empty, so a double click keeps the first one.
      await prisma.user.updateMany({ where: { id: userId, referralCode: null }, data: { referralCode: generateReferralCode() } });
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
      return NextResponse.json({ success: true, data: { code: user?.referralCode } });
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
    }
  }
  return NextResponse.json({ success: false, message: "Gagal membuat kode, coba lagi." }, { status: 500 });
}
