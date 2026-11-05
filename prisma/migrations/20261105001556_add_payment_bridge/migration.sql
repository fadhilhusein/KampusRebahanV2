-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "bridgeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "bridgePaymentUrl" TEXT,
ADD COLUMN     "bridgeRef" TEXT,
ADD COLUMN     "bridgeStatus" TEXT;
