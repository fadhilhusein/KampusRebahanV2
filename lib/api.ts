import type {
  ProductsResponse,
  OrderPayload,
  OrderResponse,
  BalanceResponse,
} from "./types";

const BASE = process.env.WARUNG_PROXY_URL
  ? process.env.WARUNG_PROXY_URL
  : "https://warungrebahan.com/api/v1";

const USE_PROXY = !!process.env.WARUNG_PROXY_URL;

async function post<T>(
  endpoint: string,
  body: Record<string, unknown> = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (USE_PROXY && process.env.PROXY_SECRET) {
    headers["x-proxy-secret"] = process.env.PROXY_SECRET;
  }

  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(
      USE_PROXY ? body : { api_key: process.env.WARUNGREBAHAN_API_KEY, ...body }
    ),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Warungrebahan API error ${res.status}: ${endpoint}${text ? ` — ${text}` : ""}`);
  }

  return res.json() as Promise<T>;
}

// Supplier products we don't sell (e.g. the supplier's "API Testing" item). Filtered here so
// listings, product pages and order creation all ignore them.
const HIDDEN_PRODUCT_IDS = new Set(["945f105a-1b14-11f1-bf18-bc241112a182"]);

export const warungApi = {
  getProducts: async () => {
    const res = await post<ProductsResponse>("/products");
    if (res.success) res.data = res.data.filter((p) => !HIDDEN_PRODUCT_IDS.has(p.id));
    return res;
  },

  getBalance: () =>
    post<BalanceResponse>("/balance"),

  createOrder: (payload: OrderPayload) =>
    post<OrderResponse>("/order", payload as unknown as Record<string, unknown>),

  getTransactions: () =>
    post<{ success: boolean; data: unknown[] }>("/transactions"),
};
