import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import type { WebhookPayload } from "@/lib/types";
import { applySupplierStatus } from "@/lib/supplierSync";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-rebahan-signature") ?? "";
  const rawBody = await req.text();

  const secret = process.env.WARUNGREBAHAN_API_KEY ?? "";
  const expected = createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);

  if (
    sigBuf.length !== expBuf.length ||
    !timingSafeEqual(sigBuf, expBuf)
  ) {
    return NextResponse.json({ status: "invalid signature" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ status: "invalid json" }, { status: 400 });
  }

  const { event, data } = payload;

  console.log("[webhook]", event, data?.order_id);

  if (typeof data?.order_id === "string") {
    if (event === "order.completed") await applySupplierStatus(data.order_id, "completed");
    else if (event === "order.failed") await applySupplierStatus(data.order_id, "failed");
    else if (event !== "order.processing") console.warn("[webhook] unknown event:", event);
  }

  return NextResponse.json({ status: "ok" });
}
