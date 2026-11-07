-- AlterTable
ALTER TABLE "BalanceTopUp" ADD COLUMN     "bridgeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "bridgePaymentUrl" TEXT,
ADD COLUMN     "bridgeRef" TEXT,
ADD COLUMN     "bridgeStatus" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BalanceTopUp_bridgeRef_key" ON "BalanceTopUp"("bridgeRef");
