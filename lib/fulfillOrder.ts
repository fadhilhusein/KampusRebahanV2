import { prisma } from "@/lib/prisma";
import { warungApi } from "@/lib/api";
import type { OrderPayload } from "@/lib/types";
import { creditCommission } from "@/lib/referral";
import { sendPaidOrderEmail } from "@/lib/mailer";
import { notifyOrderCompleted } from "@/lib/supplierSync";
import { orderAlert, paidOrderText, sendOwnerWhatsApp } from "@/lib/whatsapp";
import type { Order } from "@/lib/generated/prisma";

export interface FulfillOrderResult {
  success: boolean;
  message: string;
  apiOrderId?: string;
  /** Supplier delivered right away, so the order is already COMPLETED. */
  delivered?: boolean;
}

export async function fulfillOrder(orderId: string): Promise<FulfillOrderResult> {
  // Atomically claim the order so a webhook and a status-poll racing each other
  // can't both call warungApi.createOrder for the same order. The first claim (payment just
  // landed) is told apart from an admin retry of AWAITING_RETRY, which uses the same
  // compare-and-swap guard, so the owner gets exactly one "paid" email per order.
  const firstClaim = await prisma.order.updateMany({
    where: { id: orderId, status: { in: ["PENDING_PAYMENT", "PAID"] } },
    data: { status: "PROCESSING" },
  });
  const claimed =
    firstClaim.count > 0
      ? firstClaim
      : await prisma.order.updateMany({ where: { id: orderId, status: "AWAITING_RETRY" }, data: { status: "PROCESSING" } });

  if (claimed.count === 0) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return { success: false, message: "Order tidak ditemukan." };
    return { success: false, message: `Order status: ${order.status}. Tidak bisa dikonfirmasi.` };
  }

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { user: { select: { name: true, email: true } } } });
  if (!order) return { success: false, message: "Order tidak ditemukan." };

  const result = await processClaimedOrder(order);

  // Free coupon rewards aren't purchases, so they don't alert the owner.
  if (firstClaim.count > 0 && order.paymentMethod !== "COUPON") {
    const alert = orderAlert(order);
    const status = result.success ? "Diteruskan ke supplier" : "Gagal ke supplier, perlu retry admin";
    await Promise.all([
      sendPaidOrderEmail({ ...alert, status, note: result.success ? undefined : result.message }),
      sendOwnerWhatsApp(paidOrderText(alert, status), `paid:${order.id}`),
    ]);
  }
  if (result.delivered) await notifyOrderCompleted(order.id);
  return result;
}

async function processClaimedOrder(order: Order): Promise<FulfillOrderResult> {
  const orderId = order.id;
  try {
    const payload: OrderPayload = {
      variant_id: order.variantId,
      quantity: order.quantity,
      ...(order.type === "Invite" && order.emailInvite ? { email_invite: order.emailInvite } : {}),
    };

    const apiResult = await warungApi.createOrder(payload);

    if (apiResult.success) {
      const apiOrderId = apiResult.data?.order_id;
      // Accepted is not delivered: stay PROCESSING until the supplier reports "completed"
      // (webhook or syncSupplierOrders), so rewards and commissions wait for real delivery.
      const delivered = apiResult.data?.status?.toLowerCase() === "completed";
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: delivered ? "COMPLETED" : "PROCESSING",
          completedAt: delivered ? new Date() : null,
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

      if (delivered) await creditCommission(orderId);

      return {
        success: true,
        message: delivered ? "Order dikonfirmasi dan akun dikirim." : "Order diteruskan ke supplier, akun dikirim setelah supplier menyelesaikannya.",
        apiOrderId,
        delivered,
      };
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
