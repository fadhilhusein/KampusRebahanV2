import { prisma } from "@/lib/prisma";
import { warungApi } from "@/lib/api";
import type { OrderPayload } from "@/lib/types";

export interface FulfillOrderResult {
  success: boolean;
  message: string;
  apiOrderId?: string;
}

export async function fulfillOrder(orderId: string): Promise<FulfillOrderResult> {
  // Atomically claim the order so a webhook and a status-poll racing each other
  // can't both call warungApi.createOrder for the same order. AWAITING_RETRY is
  // included so an admin retry (e.g. after topping up Warung Rebahan balance)
  // uses the same compare-and-swap guard.
  const claimed = await prisma.order.updateMany({
    where: { id: orderId, status: { in: ["PENDING_PAYMENT", "PAID", "AWAITING_RETRY"] } },
    data: { status: "PROCESSING" },
  });

  if (claimed.count === 0) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return { success: false, message: "Order tidak ditemukan." };
    return { success: false, message: `Order status: ${order.status}. Tidak bisa dikonfirmasi.` };
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { success: false, message: "Order tidak ditemukan." };

  try {
    const payload: OrderPayload = {
      variant_id: order.variantId,
      quantity: order.quantity,
      ...(order.type === "Invite" && order.emailInvite ? { email_invite: order.emailInvite } : {}),
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

      if (apiOrderId) {
        await prisma.userOrder.upsert({
          where: { orderId: apiOrderId },
          create: { userId: order.userId, orderId: apiOrderId, orderData: apiResult.data as object },
          update: {},
        });
      }

      return { success: true, message: "Order dikonfirmasi dan akun dikirim.", apiOrderId };
    } else {
      // Payment was already received — don't dead-end the order as FAILED.
      // AWAITING_RETRY keeps it customer-invisible ("diproses") while surfacing
      // the real reason (e.g. insufficient Warung Rebahan balance) to admin for retry.
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "AWAITING_RETRY", apiResponse: apiResult as object },
      });
      return { success: false, message: apiResult.message ?? "Gagal call API warungrebahan. Order menunggu retry admin." };
    }
  } catch (err) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "AWAITING_RETRY", apiResponse: { error: String(err) } },
    });
    return { success: false, message: `${String(err)} — order menunggu retry admin.` };
  }
}
