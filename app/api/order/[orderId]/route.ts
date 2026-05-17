import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!order) return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });

  const userId =
    (session?.user as { id?: string })?.id ??
    (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id;

  if (order.userId !== userId) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  return NextResponse.json({ success: true, data: order });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { orderId } = await params;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });

  const userId =
    (session?.user as { id?: string })?.id ??
    (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id;

  if (order.userId !== userId) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { action } = body;

  if (action === "confirm_payment") {
    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ success: false, message: "Status order tidak valid." }, { status: 400 });
    }
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });
    return NextResponse.json({ success: true, data: updated });
  }

  return NextResponse.json({ success: false, message: "Action tidak dikenali." }, { status: 400 });
}
