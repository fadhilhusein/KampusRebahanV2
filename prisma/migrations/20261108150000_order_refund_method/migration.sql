-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "refundAmount" INTEGER,
ADD COLUMN     "refundMethod" TEXT;

-- Existing refunds were all credited to the customer's wallet.
UPDATE "Order" o
SET "refundMethod" = 'BALANCE',
    "refundAmount" = t."amount"
FROM (
  SELECT DISTINCT ON ("orderId") "orderId", "amount"
  FROM "BalanceTransaction"
  WHERE "type" = 'REFUND' AND "orderId" IS NOT NULL
  ORDER BY "orderId", "createdAt" DESC
) t
WHERE o."id" = t."orderId" AND o."refundedAt" IS NOT NULL;
