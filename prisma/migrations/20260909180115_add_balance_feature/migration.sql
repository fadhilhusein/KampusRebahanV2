-- CreateEnum
CREATE TYPE "TopUpStatus" AS ENUM ('PENDING', 'PAID', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BalanceTxnType" AS ENUM ('TOPUP', 'PURCHASE', 'REFUND', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "balance" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "refundedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BalanceTopUp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "TopUpStatus" NOT NULL DEFAULT 'PENDING',
    "gatewayInvoiceId" TEXT,
    "gatewayQrString" TEXT,
    "gatewayStatus" TEXT,
    "gatewayExpiresAt" TIMESTAMP(3),
    "creditedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BalanceTopUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BalanceTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "BalanceTxnType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "topUpId" TEXT,
    "orderId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BalanceTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BalanceTopUp_gatewayInvoiceId_key" ON "BalanceTopUp"("gatewayInvoiceId");

-- CreateIndex
CREATE INDEX "BalanceTopUp_userId_idx" ON "BalanceTopUp"("userId");

-- CreateIndex
CREATE INDEX "BalanceTopUp_status_idx" ON "BalanceTopUp"("status");

-- CreateIndex
CREATE INDEX "BalanceTransaction_userId_idx" ON "BalanceTransaction"("userId");

-- CreateIndex
CREATE INDEX "BalanceTransaction_orderId_idx" ON "BalanceTransaction"("orderId");

-- AddForeignKey
ALTER TABLE "BalanceTopUp" ADD CONSTRAINT "BalanceTopUp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceTransaction" ADD CONSTRAINT "BalanceTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
