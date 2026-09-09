import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { bayarGg } from "@/lib/bayarGg";
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

  if (!topup.gatewayInvoiceId) {
    return NextResponse.json({ success: false, message: "Top up ini tidak memakai QRIS gateway." }, { status: 400 });
  }

  if (topup.status !== "PENDING") {
    return NextResponse.json({ success: true, data: { status: topup.gatewayStatus ?? topup.status } });
  }

  const check = await bayarGg.checkPayment(topup.gatewayInvoiceId);
  if (!check.success) {
    return NextResponse.json({ success: false, message: check.error }, { status: 502 });
  }

  await prisma.balanceTopUp.update({ where: { id: topupId }, data: { gatewayStatus: check.data.status } });

  if (check.data.status === "paid") {
    const result = await creditTopUp(topupId);
    return NextResponse.json({ success: result.success, message: result.message, data: { status: "paid" } });
  }

  if (check.data.status === "expired" || check.data.status === "cancelled") {
    await prisma.balanceTopUp.update({ where: { id: topupId }, data: { status: "EXPIRED" } });
  }

  return NextResponse.json({ success: true, data: { status: check.data.status } });
}
