-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "gatewayExpiresAt" TIMESTAMP(3),
ADD COLUMN     "gatewayInvoiceId" TEXT,
ADD COLUMN     "gatewayQrString" TEXT,
ADD COLUMN     "gatewayStatus" TEXT;
