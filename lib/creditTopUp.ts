import { prisma } from "@/lib/prisma";

export interface CreditTopUpResult {
  success: boolean;
  message: string;
}

export async function creditTopUp(topupId: string): Promise<CreditTopUpResult> {
  // Atomic claim: only one caller (webhook vs. status-poll racing each other)
  // can transition PENDING -> PAID, so the balance is credited exactly once.
  const claimed = await prisma.balanceTopUp.updateMany({
    where: { id: topupId, status: "PENDING" },
    data: { status: "PAID", creditedAt: new Date() },
  });

  if (claimed.count === 0) {
    return { success: false, message: "Top-up sudah diproses atau tidak valid." };
  }

  const topup = await prisma.balanceTopUp.findUnique({ where: { id: topupId } });
  if (!topup) {
    return { success: false, message: "Top-up tidak ditemukan." };
  }

  const updatedUser = await prisma.user.update({
    where: { id: topup.userId },
    data: { balance: { increment: topup.amount } },
  });

  await prisma.balanceTransaction.create({
    data: {
      userId: topup.userId,
      type: "TOPUP",
      amount: topup.amount,
      balanceAfter: updatedUser.balance,
      topUpId: topup.id,
    },
  });

  return { success: true, message: "Saldo berhasil ditambahkan." };
}
