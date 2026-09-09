import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyBayarGgWebhookSignature } from "@/lib/bayarGg";
import { fulfillOrder } from "@/lib/fulfillOrder";
import { creditTopUp } from "@/lib/creditTopUp";
import type { BayarGgWebhookPayload } from "@/lib/types";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  let payload: BayarGgWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ status: "invalid json" }, { status: 400 });
  }

  const signature = req.headers.get("x-webhook-signature") ?? payload.signature ?? "";
  const timestamp = req.headers.get("x-webhook-timestamp") ?? String(payload.timestamp);

  const valid = verifyBayarGgWebhookSignature(
    payload.invoice_id,
    payload.status,
    payload.final_amount,
    timestamp,
    signature
  );

  if (!valid) {
    return NextResponse.json({ status: "invalid signature" }, { status: 401 });
  }

  if (payload.event !== "payment.paid" || payload.status !== "paid") {
    return NextResponse.json({ status: "ignored" });
  }

  const order = await prisma.order.findFirst({ where: { gatewayInvoiceId: payload.invoice_id } });
  if (order) {
    await prisma.order.update({ where: { id: order.id }, data: { gatewayStatus: payload.status } });
    const result = await fulfillOrder(order.id);
    return NextResponse.json({ status: result.success ? "ok" : "error", message: result.message });
  }

  const topup = await prisma.balanceTopUp.findFirst({ where: { gatewayInvoiceId: payload.invoice_id } });
  if (topup) {
    await prisma.balanceTopUp.update({ where: { id: topup.id }, data: { gatewayStatus: payload.status } });
    const result = await creditTopUp(topup.id);
    return NextResponse.json({ status: result.success ? "ok" : "error", message: result.message });
  }

  return NextResponse.json({ status: "invoice not found" }, { status: 404 });
}
