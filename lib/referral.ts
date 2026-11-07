import { randomInt } from "crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { calcCommission } from "@/lib/commission";
import { getReferralCommissionPercent } from "@/lib/settings";

type Tx = Prisma.TransactionClient;
export type WalletKind = "MAIN" | "REFERRAL";

export const REF_COOKIE = "kr_ref";
export const REF_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
export const PAYOUT_METHODS = ["DANA", "OVO", "GOPAY", "SHOPEEPAY", "BANK"] as const;

export async function getSessionUserId(): Promise<string | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return (
    (session.user as { id?: string }).id ??
    (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id ??
    null
  );
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReferralCode(): string {
  return Array.from({ length: 8 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
}

export function isUniqueViolation(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

const walletField = (w: WalletKind) => (w === "MAIN" ? "balance" : "referralBalance");

/** Atomic check-and-debit. Returns the balance after, or null when it's too low. */
export async function debitWallet(tx: Tx, userId: string, wallet: WalletKind, amount: number): Promise<number | null> {
  const field = walletField(wallet);
  const debited = await tx.user.updateMany({
    where: { id: userId, [field]: { gte: amount } },
    data: { [field]: { decrement: amount } },
  });
  if (debited.count === 0) return null;
  const user = await tx.user.findUniqueOrThrow({ where: { id: userId }, select: { balance: true, referralBalance: true } });
  return user[field];
}

/** Adds (or with a negative amount, removes) money without a floor; returns the balance after. */
export async function creditWallet(tx: Tx, userId: string, wallet: WalletKind, amount: number): Promise<number> {
  const field = walletField(wallet);
  const user = await tx.user.update({ where: { id: userId }, data: { [field]: { increment: amount } } });
  return user[field];
}

/**
 * Credits the referrer once per COMPLETED order. Safe to call repeatedly: the unique
 * ReferralCommission.orderId makes a second call roll back as a no-op.
 */
export async function creditCommission(orderId: string): Promise<void> {
  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== "COMPLETED" || order.refundedAt) return;
    if (!order.referrerId || order.referrerId === order.userId || order.paymentMethod === "COUPON") return;

    const amount = calcCommission(order.sellPrice, order.costPrice, await getReferralCommissionPercent());
    if (amount <= 0) return;
    const referrerId = order.referrerId;

    await prisma.$transaction(async (tx) => {
      await tx.referralCommission.create({ data: { orderId, referrerId, amount } });
      const balanceAfter = await creditWallet(tx, referrerId, "REFERRAL", amount);
      await tx.balanceTransaction.create({
        data: {
          userId: referrerId,
          wallet: "REFERRAL",
          type: "COMMISSION",
          amount,
          balanceAfter,
          orderId,
          note: `${order.productName} - ${order.variantName}`,
        },
      });
    });
  } catch (err) {
    if (isUniqueViolation(err)) return;
    // Never fail fulfillment over a commission; log for manual follow-up.
    console.error("creditCommission failed", orderId, err);
  }
}

/** Takes back a credited commission (order rejected/refunded). The balance may go negative. */
export async function reverseCommission(tx: Tx, orderId: string): Promise<void> {
  const claimed = await tx.referralCommission.updateMany({
    where: { orderId, status: "CREDITED" },
    data: { status: "REVERSED", reversedAt: new Date() },
  });
  if (claimed.count === 0) return;

  const commission = await tx.referralCommission.findUniqueOrThrow({ where: { orderId } });
  const balanceAfter = await creditWallet(tx, commission.referrerId, "REFERRAL", -commission.amount);
  await tx.balanceTransaction.create({
    data: {
      userId: commission.referrerId,
      wallet: "REFERRAL",
      type: "COMMISSION_REVERSAL",
      amount: -commission.amount,
      balanceAfter,
      orderId,
    },
  });
}

/** Referrer id from the ref cookie, ignoring unknown codes and self-referral. */
export async function resolveReferrer(code: string | undefined, buyerId: string): Promise<string | null> {
  if (!code || code.length > 16) return null;
  const referrer = await prisma.user.findUnique({ where: { referralCode: code.toUpperCase() }, select: { id: true } });
  return referrer && referrer.id !== buyerId ? referrer.id : null;
}
