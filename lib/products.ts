import { after } from "next/server";
import { warungApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getMarkupPercent } from "@/lib/settings";
import type { Product, ProductsResponse } from "@/lib/types";
import { reservedByVariant } from "@/lib/stock";
import { availableStock } from "@/lib/stockRules";

class SupplierUnavailable extends Error {
  constructor(public response: ProductsResponse) {
    super("supplier unavailable");
  }
}

type Catalog = ProductsResponse & { fetchedAt: number };

// The supplier catalog takes ~5s to fetch, so listings read a copy stored in the Setting table
// (shared by every server instance) and refresh it in the background once it is a minute old.
// Display only: checkout re-reads supplier stock fresh under the stock lock (app/api/order).
const CACHE_KEY = "catalog_cache";
const MAX_AGE_MS = 60_000;
let refreshing = false; // one background refresh per instance at a time

async function fetchCatalog(): Promise<Catalog> {
  const data = await warungApi.getProducts();
  if (!data.success) throw new SupplierUnavailable(data);

  const [soldRows, reviewRows, markup] = await Promise.all([
    prisma.order.groupBy({ by: ["productName"], where: { status: "COMPLETED" }, _sum: { quantity: true } }),
    prisma.productReview.groupBy({ by: ["productName"], _avg: { rating: true }, _count: { _all: true } }),
    getMarkupPercent(),
  ]);
  const sold = new Map(soldRows.map((r) => [r.productName, r._sum.quantity ?? 0]));
  const reviews = new Map(reviewRows.map((r) => [r.productName, { averageRating: r._avg.rating, reviewCount: r._count._all }]));

  const catalog: Catalog = {
    ...data,
    fetchedAt: Date.now(),
    data: data.data.map((product: Product) => ({
      ...product,
      soldCount: sold.get(product.name) ?? 0,
      averageRating: reviews.get(product.name)?.averageRating ?? null,
      reviewCount: reviews.get(product.name)?.reviewCount ?? 0,
      variants: product.variants.map((v) => ({ ...v, price: markup > 0 ? Math.ceil(v.price * (1 + markup / 100)) : v.price })),
    })),
  };
  const value = JSON.stringify(catalog);
  await prisma.setting.upsert({ where: { key: CACHE_KEY }, update: { value }, create: { key: CACHE_KEY, value } });
  return catalog;
}

async function readCatalog(): Promise<Catalog | null> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: CACHE_KEY } });
    return row ? (JSON.parse(row.value) as Catalog) : null;
  } catch {
    return null;
  }
}

export async function getProductsWithStats(): Promise<ProductsResponse> {
  const [cached, reserved] = await Promise.all([readCatalog(), reservedByVariant(prisma)]);

  let catalog = cached;
  if (!catalog) {
    // First visit ever (or unreadable copy): this one has to wait for the supplier.
    try {
      catalog = await fetchCatalog();
    } catch (err) {
      if (err instanceof SupplierUnavailable) return err.response;
      throw err;
    }
  } else if (Date.now() - catalog.fetchedAt > MAX_AGE_MS && !refreshing) {
    refreshing = true;
    after(() =>
      fetchCatalog()
        .catch(() => {}) // keep serving the old copy if the supplier is down
        .finally(() => (refreshing = false))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fetchedAt, ...response } = catalog;
  // Live on every request: stock shown excludes units our open orders hold.
  return {
    ...response,
    data: catalog.data.map((product) => ({
      ...product,
      variants: product.variants.map((v) => ({ ...v, stock: availableStock(v.stock, reserved.get(v.id) ?? 0) })),
    })),
  };
}
