CREATE TABLE "ProductReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "testimonial" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductReview_orderId_key" ON "ProductReview"("orderId");
CREATE INDEX "ProductReview_productName_idx" ON "ProductReview"("productName");
CREATE INDEX "ProductReview_userId_idx" ON "ProductReview"("userId");

ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
