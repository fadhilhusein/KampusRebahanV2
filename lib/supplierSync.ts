import { prisma } from "@/lib/prisma";
import { warungApi } from "@/lib/api";
import { creditCommission } from "@/lib/referral";

// warungrebahan accepts an order as "processing" and later reports "completed" once the
// account is delivered (PO products can take days). Our order only becomes COMPLETED then.
const FAILED_STATUSES = ["failed", "cancelled", "canceled", "refunded", "expired"];

/** PROCESSING → COMPLETED once; credits the referral commission on the winning call. */
export async function markOrderCompleted(orderId: string): Promise<boolean> {
  const claimed = await prisma.order.updateMany({
    where: { id: orderId, status: "PROCESSING", apiOrderId: { not: null } },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
  if (claimed.count === 0) return false;
  await creditCommission(orderId);
  return true;
}

/** Applies a supplier status (from the webhook or the transactions list) to our order. */
export async function applySupplierStatus(apiOrderId: string, status: string): Promise<void> {
  const order = await prisma.order.findFirst({ where: { apiOrderId }, select: { id: true } });
  if (!order) return;

  const s = status.toLowerCase();
  if (s === "completed") {
    await markOrderCompleted(order.id);
  } else if (FAILED_STATUSES.includes(s)) {
    // Paid but the supplier gave up: hand it to admin (retry or refund) instead of completing it.
    await prisma.order.updateMany({
      where: { id: order.id, status: "PROCESSING" },
      data: { status: "AWAITING_RETRY", apiResponse: { supplier_status: s } },
    });
  }
}

/**
 * Fallback for missed webhooks: checks the supplier's transaction list for our orders that are
 * still waiting on delivery. Skips the supplier call when nothing is waiting.
 */
export async function syncSupplierOrders(filter: { userId?: string; orderId?: string } = {}): Promise<void> {
  try {
    const waiting = await prisma.order.findMany({
      where: { status: "PROCESSING", apiOrderId: { not: null }, ...filter },
      select: { apiOrderId: true },
    });
    if (waiting.length === 0) return;

    const res = await warungApi.getTransactions();
    if (!res.success) return;
    const statusById = new Map(
      (res.data as Array<{ order_id?: string; status?: string }>)
        .filter((t) => t.order_id && t.status)
        .map((t) => [t.order_id!, t.status!])
    );

    for (const { apiOrderId } of waiting) {
      const status = statusById.get(apiOrderId!);
      if (status) await applySupplierStatus(apiOrderId!, status);
    }
  } catch (err) {
    console.error("syncSupplierOrders failed", err);
  }
}
