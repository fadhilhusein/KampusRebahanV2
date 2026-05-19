import { warungApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getMarkupPercent } from "@/lib/settings";
import type { Product, ProductsResponse } from "@/lib/types";

export async function getProductsWithStats(): Promise<ProductsResponse> {
  const data = await warungApi.getProducts();

  if (!data.success) return data;

  const [soldRows, reviewRows, markup] = await Promise.all([
    prisma.order.groupBy({
      by: ["productName"],
      where: { status: "COMPLETED" },
      _sum: { quantity: true },
    }),
    prisma.productReview.groupBy({
      by: ["productName"],
      _avg: { rating: true },
      _count: { _all: true },
    }),
    getMarkupPercent(),
  ]);

  const soldByProduct = new Map(
    soldRows.map((row) => [row.productName, row._sum.quantity ?? 0])
  );
  const reviewsByProduct = new Map(
    reviewRows.map((row) => [
      row.productName,
      {
        averageRating: row._avg.rating,
        reviewCount: row._count._all,
      },
    ])
  );

  return {
    ...data,
    data: data.data.map((product: Product) => ({
      ...product,
      soldCount: soldByProduct.get(product.name) ?? 0,
      averageRating: reviewsByProduct.get(product.name)?.averageRating ?? null,
      reviewCount: reviewsByProduct.get(product.name)?.reviewCount ?? 0,
      variants:
        markup > 0
          ? product.variants.map((variant) => ({
              ...variant,
              price: Math.ceil(variant.price * (1 + markup / 100)),
            }))
          : product.variants,
    })),
  };
}
