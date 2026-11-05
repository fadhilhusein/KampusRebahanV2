import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { requireAdmin } from "@/lib/adminAuth";
import { paymentBridge } from "@/lib/paymentBridge";
import { fulfillOrder } from "@/lib/fulfillOrder";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });

  const session = await auth();
  const email = session?.user?.email;
  const userId = email
    ? ((session?.user as { id?: string })?.id ?? (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id)
    : undefined;

  const isOwner = !!userId && order.userId === userId;
  const isAuthorized = isOwner || !!(await requireAdmin());
  if (!isAuthorized) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  if (!order.bridgeRef) {
    return NextResponse.json({ success: false, message: "Order ini tidak memakai QRIS Bridge." }, { status: 400 });
  }

  if (order.status !== "PENDING_PAYMENT" && order.status !== "PAID") {
    return NextResponse.json({ success: true, data: { status: order.bridgeStatus ?? order.status } });
  }

  const check = await paymentBridge.getPaymentByOrderId(order.id);
  if (!check.success) {
    return NextResponse.json({ success: false, message: check.error }, { status: 502 });
  }

  await prisma.order.update({ where: { id: orderId }, data: { bridgeStatus: check.data.status } });

  if (check.data.status === "paid") {
    const result = await fulfillOrder(orderId);
    return NextResponse.json({ success: result.success, message: result.message, data: { status: "paid" } });
  }

  if (check.data.status === "expired" || check.data.status === "failed") {
    await prisma.order.update({ where: { id: orderId }, data: { status: "EXPIRED" } });
  }

  return NextResponse.json({ success: true, data: { status: check.data.status } });
}
