import { createHmac, timingSafeEqual } from "crypto";
import type {
  BayarGgResponse,
  BayarGgCreatePaymentPayload,
  BayarGgCreatePaymentData,
  BayarGgCheckPaymentData,
} from "./types";

const BASE = "https://www.bayar.gg/api";

// QRIS Admin (the free, no-subscription method) is capped at Rp 500.000 per transaction.
export const QRIS_GATEWAY_MAX_AMOUNT = 500000;

// Balance top-up bounds — max mirrors the QRIS gateway cap above since top-ups go through the same gateway.
export const TOPUP_MIN_AMOUNT = 10000;

async function call<T>(
  method: "GET" | "POST",
  endpoint: string,
  params: Record<string, unknown> = {}
): Promise<BayarGgResponse<T>> {
  const headers: Record<string, string> = { "X-API-Key": process.env.BAYARGG_API_KEY ?? "" };
  const init: RequestInit = { method, headers };
  let url = `${BASE}${endpoint}`;

  if (method === "GET") {
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    if (query) url += `?${query}`;
  } else {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(params);
  }

  const res = await fetch(url, init);
  const body = (await res.json().catch(() => null)) as BayarGgResponse<T> | null;

  if (!body) {
    return { success: false, error: `Bayar.gg API error ${res.status}: ${endpoint}` };
  }

  return body;
}

// check-payment.php (unlike create-payment.php) returns its fields flat at the
// top level instead of nested under `data`, so it needs its own unwrapping.
async function callFlat<T>(
  method: "GET" | "POST",
  endpoint: string,
  params: Record<string, unknown> = {}
): Promise<BayarGgResponse<T>> {
  const headers: Record<string, string> = { "X-API-Key": process.env.BAYARGG_API_KEY ?? "" };
  const init: RequestInit = { method, headers };
  let url = `${BASE}${endpoint}`;

  if (method === "GET") {
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    if (query) url += `?${query}`;
  } else {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(params);
  }

  const res = await fetch(url, init);
  const body = (await res.json().catch(() => null)) as ({ success: boolean; error?: string } & Record<string, unknown>) | null;

  if (!body) {
    return { success: false, error: `Bayar.gg API error ${res.status}: ${endpoint}` };
  }

  if (!body.success) {
    return { success: false, error: body.error ?? `Bayar.gg API error: ${endpoint}` };
  }

  const { success: _success, ...data } = body;
  return { success: true, data: data as T };
}

export const bayarGg = {
  createPayment: (payload: BayarGgCreatePaymentPayload) =>
    call<BayarGgCreatePaymentData>(
      "POST",
      "/create-payment.php",
      payload as unknown as Record<string, unknown>
    ),

  checkPayment: (invoice: string) =>
    callFlat<BayarGgCheckPaymentData>("GET", "/check-payment.php", { invoice }),
};

export function verifyBayarGgWebhookSignature(
  invoiceId: string,
  status: string,
  finalAmount: number | string,
  timestamp: number | string,
  signature: string
): boolean {
  const secret = process.env.BAYARGG_WEBHOOK_SECRET ?? "";
  const signatureData = `${invoiceId}|${status}|${finalAmount}|${timestamp}`;
  const expected = createHmac("sha256", secret).update(signatureData).digest("hex");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);

  return sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf);
}
