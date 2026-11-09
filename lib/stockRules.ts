// Pure rules for local stock reservation, kept free of Prisma so they can be unit-tested.

/** How long an unpaid order may wait for payment (QRIS links and bank transfers alike). */
export const PAYMENT_WINDOW_MS = 60 * 60_000;
// A little slack past the window so an order paid in its last seconds still holds its unit.
const HOLD_GRACE_MS = 5 * 60_000;

/** Statuses where an order of ours may still take a unit from the supplier. */
export const HOLDING_STATUSES = ["PENDING_PAYMENT", "PAID", "AWAITING_RETRY"] as const;

export interface HoldCandidate {
  status: string;
  createdAt: Date;
  gatewayExpiresAt: Date | null;
  bridgeExpiresAt: Date | null;
}

/**
 * True when this order still reserves its quantity. Paid orders that haven't reached the
 * supplier always hold. Unpaid ones hold until their payment link expires, capped at the
 * payment window so links made before the 1h limit (or with a wrong expiry) can't lock stock for a day.
 * PROCESSING / COMPLETED orders are already counted in the supplier's own stock.
 */
export function isHolding(o: HoldCandidate, now: Date): boolean {
  if (o.status === "PAID" || o.status === "AWAITING_RETRY") return true;
  if (o.status !== "PENDING_PAYMENT") return false;
  const cap = o.createdAt.getTime() + PAYMENT_WINDOW_MS + HOLD_GRACE_MS;
  const expiry = (o.gatewayExpiresAt ?? o.bridgeExpiresAt)?.getTime() ?? o.createdAt.getTime() + PAYMENT_WINDOW_MS;
  return now.getTime() < Math.min(expiry, cap);
}

/** Units the shop can still sell: supplier stock minus what our own open orders hold. */
export const availableStock = (supplierStock: number, reserved: number) => Math.max(0, supplierStock - reserved);

/**
 * Bayar.gg sends `expires_at` as a WIB wall-clock time without an offset ("2026-11-08 15:30:00").
 * `new Date()` reads that as server-local time, which is UTC in production: 7 hours late.
 */
export function parseGatewayTime(value: string): Date {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/i.test(value.trim());
  return new Date(hasZone ? value : `${value.trim().replace(" ", "T")}+07:00`);
}

/** Unpaid bank transfers past the payment window can no longer be confirmed by the customer. */
export const isBankTransferExpired = (createdAt: Date, now: Date) => now.getTime() > createdAt.getTime() + PAYMENT_WINDOW_MS;
