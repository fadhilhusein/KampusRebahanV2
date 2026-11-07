-- CreateEnum
CREATE TYPE "Wallet" AS ENUM ('MAIN', 'REFERRAL');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('CREDITED', 'REVERSED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PAID', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BalanceTxnType" ADD VALUE 'COMMISSION';
ALTER TYPE "BalanceTxnType" ADD VALUE 'COMMISSION_REVERSAL';
ALTER TYPE "BalanceTxnType" ADD VALUE 'PAYOUT';
ALTER TYPE "BalanceTxnType" ADD VALUE 'PAYOUT_REVERSAL';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "referralBalance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "referralClicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "referralCode" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "referrerId" TEXT;

-- AlterTable
ALTER TABLE "BalanceTransaction" ADD COLUMN     "wallet" "Wallet" NOT NULL DEFAULT 'MAIN';

-- CreateTable
CREATE TABLE "ReferralCommission" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'CREDITED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reversedAt" TIMESTAMP(3),

    CONSTRAINT "ReferralCommission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayoutRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCommission_orderId_key" ON "ReferralCommission"("orderId");

-- CreateIndex
CREATE INDEX "ReferralCommission_referrerId_idx" ON "ReferralCommission"("referrerId");

-- CreateIndex
CREATE INDEX "PayoutRequest_userId_idx" ON "PayoutRequest"("userId");

-- CreateIndex
CREATE INDEX "PayoutRequest_status_idx" ON "PayoutRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE INDEX "Order_referrerId_idx" ON "Order"("referrerId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralCommission" ADD CONSTRAINT "ReferralCommission_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralCommission" ADD CONSTRAINT "ReferralCommission_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutRequest" ADD CONSTRAINT "PayoutRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
