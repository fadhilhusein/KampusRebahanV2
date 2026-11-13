-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "manualAt" TIMESTAMP(3),
ADD COLUMN     "manualChannel" TEXT,
ADD COLUMN     "manualNote" TEXT;
