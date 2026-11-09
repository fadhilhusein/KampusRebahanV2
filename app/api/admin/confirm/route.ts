import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { fulfillOrder } from "@/lib/fulfillOrder";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ success: false, message: "orderId wajib diisi." }, { status: 400 });

  // A bank transfer that arrived after the 1h window expired the order; the admin has seen the money.
  await prisma.order.updateMany({ where: { id: orderId, status: "EXPIRED", paymentMethod: "BANK_TRANSFER" }, data: { status: "PAID" } });

  const result = await fulfillOrder(orderId);

  if (result.success) {
    return NextResponse.json({ success: true, message: result.message, data: { apiOrderId: result.apiOrderId } });
  }

  return NextResponse.json({ success: false, message: result.message }, { status: 400 });
}
