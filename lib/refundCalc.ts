export const REFUND_SERVICE_FEE_PERCENT = 10;

// Gateway cut the store pays on a payment, passed on to refunds as "biaya operasional".
// Only QRIS Bridge charges the store (0.7% + Rp300). Bayar.gg charges the buyer, and
// balance / bank transfer have no gateway cut.
export const REFUND_PAYMENT_METHODS = {
  QRIS_BRIDGE: "QRIS Instan",
  QRIS_GATEWAY: "QRIS Bayar.gg",
  BALANCE: "Saldo",
  REFERRAL_BALANCE: "Saldo Referensi",
  BANK_TRANSFER: "Transfer bank",
} as const;

export function operationalFee(paymentMethod: string, price: number): number {
  if (paymentMethod !== "QRIS_BRIDGE" || price <= 0) return 0;
  return Math.ceil((price * 7) / 1000) + 300;
}

export interface RefundEstimate {
  remainingDays: number;
  /** Before the operational fee. */
  gross: number;
  amount: number;
}

// refund = price × (remaining ÷ warranty) × (100% − service fee) − operational fee,
// rounded down to whole rupiah and never below 0.
// Returns null for invalid input (price < 0, warranty < 1, used outside 0..warranty, fee < 0).
export function estimateRefund(price: number, warrantyDays: number, usedDays: number, opFee = 0): RefundEstimate | null {
  if (![price, warrantyDays, usedDays, opFee].every(Number.isFinite)) return null;
  if (price < 0 || warrantyDays < 1 || usedDays < 0 || usedDays > warrantyDays || opFee < 0) return null;
  const remainingDays = warrantyDays - usedDays;
  // Integer math first so 20000 × 20 × 90 / (30 × 100) lands on 12000 exactly.
  const gross = Math.floor((price * remainingDays * (100 - REFUND_SERVICE_FEE_PERCENT)) / (warrantyDays * 100));
  return { remainingDays, gross, amount: Math.max(0, gross - Math.ceil(opFee)) };
}

const DAY_MS = 86_400_000;
const WIB_OFFSET_MS = 7 * 3_600_000;
export const UNDELIVERED_REFUND_AFTER_MS = 48 * 3_600_000;

/** "25 Hari" -> 25; "No Garansi" or anything unparseable -> null. */
export function parseWarrantyDays(text: string | null | undefined): number | null {
  const m = text?.match(/^\s*(\d+)\s*hari/i);
  const n = m ? Number(m[1]) : 0;
  return n >= 1 ? n : null;
}

// Calendar day number in Asia/Jakarta, so "used days" counts dates, not 24h blocks.
const wibDay = (d: Date) => Math.floor((d.getTime() + WIB_OFFSET_MS) / DAY_MS);

export interface OrderRefundInput {
  status: string;
  sellPrice: number;
  paymentMethod: string;
  createdAt: Date;
  completedAt: Date | null;
  refundedAt: Date | null;
  warrantyDays: number | null;
  issueAt: Date;
  now: Date;
  /** Admin cancelling an undelivered order doesn't wait for the buyer's 48h window. */
  ignoreWait?: boolean;
}

export type OrderRefundResult =
  | { eligible: true; kind: "UNDELIVERED" | "USED"; warrantyDays: number | null; usedDays: number; remainingDays: number; gross: number; opFee: number; amount: number }
  | { eligible: false; reason: string; eligibleAt?: Date };

export function estimateOrderRefund(o: OrderRefundInput): OrderRefundResult {
  if (o.refundedAt || o.status === "REJECTED") return { eligible: false, reason: "Pesanan ini sudah ditolak atau direfund." };
  if (o.issueAt.getTime() > o.now.getTime()) return { eligible: false, reason: "Tanggal kendala tidak boleh di masa depan." };

  const opFee = operationalFee(o.paymentMethod, o.sellPrice);

  if (o.status === "PAID" || o.status === "PROCESSING" || o.status === "AWAITING_RETRY") {
    // shortcut: no paidAt column, so the 48h window starts at order creation; add paidAt if admins need it exact.
    const eligibleAt = new Date(o.createdAt.getTime() + UNDELIVERED_REFUND_AFTER_MS);
    if (!o.ignoreWait && o.now < eligibleAt) return { eligible: false, reason: "Produk belum terkirim, tapi belum lewat 48 jam.", eligibleAt };
    const r = estimateRefund(o.sellPrice, o.warrantyDays ?? 1, 0, opFee)!;
    return { eligible: true, kind: "UNDELIVERED", warrantyDays: o.warrantyDays, usedDays: 0, remainingDays: o.warrantyDays ?? 0, gross: r.gross, opFee, amount: r.amount };
  }

  if (o.status !== "COMPLETED") return { eligible: false, reason: "Pesanan ini belum dibayar atau tidak aktif, jadi tidak bisa direfund." };
  if (!o.warrantyDays) return { eligible: false, reason: "Produk ini tanpa garansi, jadi refund setelah terkirim tidak berlaku." };

  const deliveredAt = o.completedAt ?? o.createdAt;
  const usedDays = wibDay(o.issueAt) - wibDay(deliveredAt);
  if (usedDays < 0) return { eligible: false, reason: "Tanggal kendala sebelum produk dikirim." };
  if (usedDays >= o.warrantyDays) return { eligible: false, reason: "Masa garansi produk ini sudah habis pada tanggal kendala." };

  const r = estimateRefund(o.sellPrice, o.warrantyDays, usedDays, opFee)!;
  return { eligible: true, kind: "USED", warrantyDays: o.warrantyDays, usedDays, remainingDays: r.remainingDays, gross: r.gross, opFee, amount: r.amount };
}
