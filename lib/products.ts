import { warungApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getMarkupPercent } from "@/lib/settings";
import type { Product, ProductsResponse } from "@/lib/types";
import { reservedByVariant } from "@/lib/stock";
import { availableStock } from "@/lib/stockRules";

// The supplier list takes ~3s. Listings reuse it for a minute; checkout still reads it fresh
// (app/api/order) and the stock lock guards the last unit, so a stale display can't oversell.
// shortcut: per-instance memory cache, move to a shared cache if traffic spreads over many instances.
const SUPPLIER_TTL_MS = 60_000;
let supplierCache: { at: number; data: ProductsResponse } | null = null;

async function supplierProducts(): Promise<ProductsResponse> {
  if (supplierCache && Date.now() - supplierCache.at < SUPPLIER_TTL_MS) return supplierCache.data;
  const data = await warungApi.getProducts();
  if (data.success) supplierCache = { at: Date.now(), data };
  return data;
}

export async function getProductsWithStats(): Promise<ProductsResponse> {
  const data = await supplierProducts();

  if (!data.success) return data;

  const [soldRows, reviewRows, markup, reserved] = await Promise.all([
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
    reservedByVariant(prisma),
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
      // Stock shown to buyers excludes units our own open orders are holding.
      variants: product.variants.map((variant) => ({
        ...variant,
        price: markup > 0 ? Math.ceil(variant.price * (1 + markup / 100)) : variant.price,
        stock: availableStock(variant.stock, reserved.get(variant.id) ?? 0),
      })),
    })),
  };
}
