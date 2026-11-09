import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma";
import { HOLDING_STATUSES, PAYMENT_WINDOW_MS, isHolding } from "@/lib/stockRules";

type Db = Prisma.TransactionClient | typeof prisma;

/** Quantity held by our own open orders, per variant. */
export async function reservedByVariant(db: Db, variantIds?: string[], now = new Date()): Promise<Map<string, number>> {
  // Older unpaid orders can't hold (capped by isHolding), so only recent ones need reading.
  const since = new Date(now.getTime() - 2 * PAYMENT_WINDOW_MS);
  const rows = await db.order.findMany({
    where: {
      status: { in: [...HOLDING_STATUSES] },
      ...(variantIds ? { variantId: { in: variantIds } } : {}),
      OR: [{ status: { in: ["PAID", "AWAITING_RETRY"] } }, { createdAt: { gt: since } }],
    },
    select: { variantId: true, quantity: true, status: true, createdAt: true, gatewayExpiresAt: true, bridgeExpiresAt: true },
  });
  const reserved = new Map<string, number>();
  for (const o of rows) if (isHolding(o, now)) reserved.set(o.variantId, (reserved.get(o.variantId) ?? 0) + o.quantity);
  return reserved;
}

/**
 * Runs `create` only if `quantity` units are still free, with a per-variant lock so two
 * checkouts can't both take the last unit. Returns "OUT_OF_STOCK" or `create`'s result.
 */
export async function withStockLock<T>(
  variantId: string,
  supplierStock: number,
  quantity: number,
  create: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T | "OUT_OF_STOCK"> {
  return prisma.$transaction(
    async (tx) => {
      // Transaction-scoped advisory lock: released automatically on commit or rollback.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${variantId}))`;
      const reserved = (await reservedByVariant(tx, [variantId])).get(variantId) ?? 0;
      if (supplierStock - reserved < quantity) return "OUT_OF_STOCK" as const;
      return create(tx);
    },
    { timeout: 20000 }
  );
}

/** An unpaid order this user still has open for the variant, if any. */
export async function openUnpaidOrder(db: Db, userId: string, variantId: string, now = new Date()) {
  const since = new Date(now.getTime() - 2 * PAYMENT_WINDOW_MS);
  const rows = await db.order.findMany({
    where: { userId, variantId, status: "PENDING_PAYMENT", createdAt: { gt: since } },
    select: { id: true, status: true, createdAt: true, gatewayExpiresAt: true, bridgeExpiresAt: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.find((o) => isHolding(o, now)) ?? null;
}
