import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { warungApi } from "@/lib/api";
import type { OrderPayload } from "@/lib/types";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ success: false, message: "orderId wajib diisi." }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });

  if (order.status !== "PENDING_PAYMENT" && order.status !== "PAID") {
    return NextResponse.json({ success: false, message: `Order status: ${order.status}. Tidak bisa dikonfirmasi.` }, { status: 400 });
  }

  // Update to PROCESSING first
  await prisma.order.update({ where: { id: orderId }, data: { status: "PROCESSING" } });

  try {
    const payload: OrderPayload = {
      variant_id: order.variantId,
      quantity: order.quantity,
    };

    const apiResult = await warungApi.createOrder(payload);

    if (apiResult.success) {
      const apiOrderId = apiResult.data?.order_id;
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "COMPLETED",
          apiOrderId,
          apiResponse: apiResult.data as object,
        },
      });

      // Save to UserOrder for transactions page
      if (apiOrderId) {
        await prisma.userOrder.upsert({
          where: { orderId: apiOrderId },
          create: { userId: order.userId, orderId: apiOrderId, orderData: apiResult.data as object },
          update: {},
        });
      }

      return NextResponse.json({ success: true, message: "Order dikonfirmasi dan akun dikirim.", data: { apiOrderId } });
    } else {
      await prisma.order.update({ where: { id: orderId }, data: { status: "FAILED", apiResponse: apiResult as object } });
      return NextResponse.json({ success: false, message: apiResult.message ?? "Gagal call API warungrebahan." }, { status: 500 });
    }
  } catch (err) {
    await prisma.order.update({ where: { id: orderId }, data: { status: "FAILED" } });
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
