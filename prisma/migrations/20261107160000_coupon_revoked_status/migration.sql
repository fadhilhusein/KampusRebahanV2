-- AlterEnum
ALTER TYPE "CouponStatus" ADD VALUE 'REVOKED';

-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "clawbackAmount" INTEGER,
ADD COLUMN     "revokedAt" TIMESTAMP(3);
