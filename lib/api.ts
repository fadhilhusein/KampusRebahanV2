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
    throw new Error(`Warungrebahan API error ${res.status}: ${endpoint}`);
  }

  return res.json() as Promise<T>;
}

export const warungApi = {
  getProducts: () =>
    post<ProductsResponse>("/products"),

  getBalance: () =>
    post<BalanceResponse>("/balance"),

  createOrder: (payload: OrderPayload) =>
    post<OrderResponse>("/order", payload as unknown as Record<string, unknown>),

  getTransactions: () =>
    post<{ success: boolean; data: unknown[] }>("/transactions"),
};
