import type {
  ProductsResponse,
  OrderPayload,
  OrderResponse,
  BalanceResponse,
} from "./types";

const BASE = "https://warungrebahan.com/api/v1";

async function post<T>(
  endpoint: string,
  body: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.WARUNGREBAHAN_API_KEY,
      ...body,
    }),
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
