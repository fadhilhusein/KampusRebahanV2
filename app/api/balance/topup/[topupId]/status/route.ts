import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { bayarGg } from "@/lib/bayarGg";
import { paymentBridge } from "@/lib/paymentBridge";
import { creditTopUp } from "@/lib/creditTopUp";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ topupId: string }> }) {
  const { topupId } = await params;
  const topup = await prisma.balanceTopUp.findUnique({ where: { id: topupId } });
  if (!topup) return NextResponse.json({ success: false, message: "Top up tidak ditemukan." }, { status: 404 });

  const session = await auth();
  const email = session?.user?.email;
  const userId = email
    ? ((session?.user as { id?: string })?.id ?? (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id)
    : undefined;

  if (topup.userId !== userId) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const isBridge = !!topup.bridgeRef;
  if (!isBridge && !topup.gatewayInvoiceId) {
    return NextResponse.json({ success: false, message: "Top up ini tidak memakai QRIS otomatis." }, { status: 400 });
  }

  if (topup.status !== "PENDING") {
    return NextResponse.json({ success: true, data: { status: (isBridge ? topup.bridgeStatus : topup.gatewayStatus) ?? topup.status } });
  }

  let status: string;
  if (isBridge) {
    const check = await paymentBridge.getPaymentByOrderId(topup.id);
    if (!check.success) return NextResponse.json({ success: false, message: check.error }, { status: 502 });
    status = check.data.status;
    await prisma.balanceTopUp.update({ where: { id: topupId }, data: { bridgeStatus: status } });
  } else {
    const check = await bayarGg.checkPayment(topup.gatewayInvoiceId!);
    if (!check.success) return NextResponse.json({ success: false, message: check.error }, { status: 502 });
    status = check.data.status;
    await prisma.balanceTopUp.update({ where: { id: topupId }, data: { gatewayStatus: status } });
  }

  if (status === "paid") {
    const result = await creditTopUp(topupId);
    return NextResponse.json({ success: result.success, message: result.message, data: { status: "paid" } });
  }

  if (["expired", "cancelled", "failed"].includes(status)) {
    await prisma.balanceTopUp.updateMany({ where: { id: topupId, status: "PENDING" }, data: { status: "EXPIRED" } });
  }

  return NextResponse.json({ success: true, data: { status } });
}
