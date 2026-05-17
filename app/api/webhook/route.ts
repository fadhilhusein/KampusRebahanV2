import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import type { WebhookPayload } from "@/lib/types";

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

  switch (event) {
    case "order.processing":
      // Order sedang diproses — tambahkan logika notifikasi di sini
      console.log("[webhook] order.processing", data.order_id);
      break;

    case "order.completed":
      // Order selesai — kirim email/notifikasi ke pembeli
      console.log("[webhook] order.completed", data.order_id);
      break;

    case "order.failed":
      // Order gagal
      console.log("[webhook] order.failed", data.order_id);
      break;

    default:
      console.warn("[webhook] unknown event:", event);
  }

  return NextResponse.json({ status: "ok" });
}
