"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { displayStatus } from "@/lib/orderStatus";

export interface AdminOrder {
  id: string;
  productName: string;
  variantName: string;
  sellPrice: number;
  costPrice: number;
  uniqueCode: number;
  quantity: number;
  status: string;
  paymentRef: string | null;
  paymentNote: string | null;
  paymentMethod: string;
  apiOrderId: string | null;
  apiResponse: unknown;
  gatewayInvoiceId: string | null;
  gatewayStatus: string | null;
  bridgeRef: string | null;
  bridgeStatus: string | null;
  refundedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  user: { email: string; name: string | null };
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export function formatDateTime(d: string) {
  return new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(d: string) {
  const min = Math.max(0, Math.round((Date.now() - new Date(d).getTime()) / 60000));
  if (min < 1) return "baru saja";
  if (min < 60) return `${min} mnt lalu`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.round(h / 24)} hari lalu`;
}

export const orderStatusKey = (o: AdminOrder) => displayStatus(o.status, o.refundedAt);

// Admin wording; the customer pages use lib/orderStatus.ts.
const statusInfo: Record<string, { label: string; color: "primary" | "secondary" | "tertiary" | "default"; tone?: string }> = {
  PENDING_PAYMENT: { label: "Menunggu bayar", color: "tertiary" },
  PAID: { label: "Menunggu verifikasi", color: "tertiary" },
  PROCESSING: { label: "Diproses", color: "default", tone: "!text-accent" },
  AWAITING_RETRY: { label: "Perlu retry", color: "primary" },
  COMPLETED: { label: "Selesai", color: "secondary" },
  FAILED: { label: "Gagal", color: "primary" },
  REJECTED: { label: "Ditolak", color: "primary" },
  REFUNDED: { label: "Direfund", color: "default", tone: "!text-danger" },
  EXPIRED: { label: "Kedaluwarsa", color: "default" },
};

export const statusLabel = (key: string) => statusInfo[key]?.label ?? key;

export function StatusBadge({ statusKey }: { statusKey: string }) {
  const info = statusInfo[statusKey] ?? { label: statusKey, color: "default" as const };
  return (
    <Badge key={statusKey} color={info.color} className={`kr-fade-in shrink-0 whitespace-nowrap ${info.tone ?? ""}`}>
      {info.label}
    </Badge>
  );
}

export const methodLabel: Record<string, string> = {
  QRIS_GATEWAY: "QRIS",
  QRIS_BRIDGE: "QRIS",
  QRIS: "QRIS",
  BANK_TRANSFER: "Transfer",
  BALANCE: "Saldo",
  REFERRAL_BALANCE: "Saldo referensi",
  COUPON: "Kupon",
};

// Keep in sync with REFUND_ELIGIBLE_STATUSES in lib/refundPreview.ts (server-only module).
export const REFUND_ELIGIBLE_STATUSES = ["PAID", "PROCESSING", "AWAITING_RETRY", "COMPLETED"];

/**
 * Orders that need the admin: failed at the supplier, waiting on the supplier, or a bank
 * transfer to verify. Unpaid QRIS carts are left out: they expire on their own.
 */
export function needsAction(o: AdminOrder) {
  return o.status === "AWAITING_RETRY" || o.status === "PROCESSING" || (o.status === "PAID" && o.paymentMethod === "BANK_TRANSFER");
}

/** Text of the supplier's failure reason stored on an AWAITING_RETRY order. */
export function failureReason(o: AdminOrder): string | null {
  if (o.status !== "AWAITING_RETRY" || o.apiResponse == null) return null;
  if (typeof o.apiResponse !== "object") return String(o.apiResponse);
  const obj = o.apiResponse as Record<string, unknown>;
  const reason = obj.error ?? obj.message ?? obj.supplier_status;
  return typeof reason === "string" ? reason : JSON.stringify(o.apiResponse);
}

/**
 * Bottom sheet on phones, centered card from md up. Native <dialog> gives focus trapping,
 * Esc and the backdrop for free (same pattern as RefundDialog and the info popup).
 */
export function Sheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  labelId,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  labelId: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelId}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="kr-fade-up m-auto max-h-[92dvh] w-[min(520px,calc(100%-32px))] max-w-none overflow-y-auto rounded-[28px] bg-surface p-0 text-ink shadow-[0_24px_64px_rgba(17,18,19,0.25)] backdrop:bg-[#111113]/65 max-md:mb-0 max-md:w-full max-md:rounded-b-none"
    >
      <div className="flex flex-col gap-5 p-5 pb-[calc(2rem+env(safe-area-inset-bottom))] md:p-7">
        <div aria-hidden="true" className="mx-auto -mt-1 h-1 w-10 rounded-full bg-hairline md:hidden" />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id={labelId} className="font-display text-[22px] font-bold leading-tight tracking-[-0.6px] md:text-2xl">{title}</h2>
            {subtitle && <div className="mt-1.5">{subtitle}</div>}
          </div>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Tutup" className="kr-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

/** Copies text and briefly swaps the label, for account numbers and IDs. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
