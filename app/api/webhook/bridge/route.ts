import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyBridgeWebhookSignature } from "@/lib/paymentBridge";
import { fulfillOrder } from "@/lib/fulfillOrder";
import { creditTopUp } from "@/lib/creditTopUp";
import type { BridgeWebhookPayload } from "@/lib/types";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-bridge-signature") ?? "";
  const timestamp = req.headers.get("x-bridge-timestamp") ?? "";

  if (!verifyBridgeWebhookSignature(timestamp, rawBody, signature)) {
    return NextResponse.json({ status: "invalid signature" }, { status: 401 });
  }

  let payload: BridgeWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ status: "invalid json" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({ where: { bridgeRef: payload.data.ref } });
  if (!order) {
    const topup = await prisma.balanceTopUp.findUnique({ where: { bridgeRef: payload.data.ref } });
    if (topup) {
      await prisma.balanceTopUp.update({ where: { id: topup.id }, data: { bridgeStatus: payload.data.status } });
      if (payload.event === "payment.paid" && payload.data.status === "paid") {
        const result = await creditTopUp(topup.id);
        return NextResponse.json({ status: "ok", message: result.message });
      }
      if (payload.event === "payment.failed" || payload.event === "payment.expired") {
        await prisma.balanceTopUp.updateMany({ where: { id: topup.id, status: "PENDING" }, data: { status: "EXPIRED" } });
      }
      return NextResponse.json({ status: "ok" });
    }
    // Ack with 200 so the bridge doesn't keep retrying (1m/5m/.../6h) for an
    // order that will never show up on our side.
    return NextResponse.json({ status: "order not found" });
  }

  // Idempotent: already-terminal orders just re-ack without reprocessing.
  await prisma.order.update({ where: { id: order.id }, data: { bridgeStatus: payload.data.status } });

  if (payload.event === "payment.paid" && payload.data.status === "paid") {
    const result = await fulfillOrder(order.id);
    return NextResponse.json({ status: result.success ? "ok" : "error", message: result.message });
  }

  if (payload.event === "payment.failed" || payload.event === "payment.expired") {
    if (order.status === "PENDING_PAYMENT" || order.status === "PAID") {
      await prisma.order.update({ where: { id: order.id }, data: { status: "EXPIRED" } });
    }
  }

  return NextResponse.json({ status: "ok" });
}
