import { createHmac, timingSafeEqual } from "crypto";
import type {
  BridgeResponse,
  BridgeCreatePaymentPayload,
  BridgePaymentData,
} from "./types";

const BASE = process.env.BRIDGE_URL ?? "";

function sign(timestamp: string, rawBody: string): string {
  return createHmac("sha256", process.env.BRIDGE_SECRET ?? "")
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
}

async function call<T>(
  method: "GET" | "POST",
  path: string,
  body?: Record<string, unknown>
): Promise<BridgeResponse<T>> {
  const rawBody = method === "GET" ? "" : JSON.stringify(body ?? {});
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = sign(timestamp, rawBody);

  const headers: Record<string, string> = {
    "X-Api-Key": process.env.BRIDGE_API_KEY ?? "",
    "X-Timestamp": timestamp,
    "X-Signature": signature,
    "Accept": "application/json",
  };

  const init: RequestInit = { method, headers };
  if (method !== "GET") {
    headers["Content-Type"] = "application/json";
    init.body = rawBody;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, init);
  } catch (err) {
    return { success: false, error: `Bridge tidak dapat dihubungi: ${String(err)}` };
  }

  const json = (await res.json().catch(() => null)) as
    | (Record<string, unknown> & { data?: T; message?: string; provider_message?: string })
    | null;

  if (!res.ok) {
    const message = typeof json?.message === "string" ? json.message : `Bridge API error ${res.status}`;
    const providerMessage = typeof json?.provider_message === "string" ? ` — ${json.provider_message}` : "";
    return { success: false, error: `${message}${providerMessage}`, status: res.status };
  }

  if (!json || !("data" in json)) {
    return { success: false, error: `Respons bridge tidak valid (${res.status})` };
  }

  return { success: true, data: json.data as T };
}

export const paymentBridge = {
  createPayment: (payload: BridgeCreatePaymentPayload) =>
    call<BridgePaymentData>("POST", "/api/v1/payments", payload as unknown as Record<string, unknown>),

  getPaymentByOrderId: (orderId: string) =>
    call<BridgePaymentData>("GET", `/api/v1/payments/order/${encodeURIComponent(orderId)}`),
};

export function verifyBridgeWebhookSignature(timestamp: string, rawBody: string, signature: string): boolean {
  if (!timestamp || !signature) return false;

  const timestampNum = Number(timestamp);
  if (!Number.isFinite(timestampNum)) return false;
  if (Math.abs(Date.now() / 1000 - timestampNum) > 5 * 60) return false;

  const expected = sign(timestamp, rawBody);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);

  return sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf);
}
