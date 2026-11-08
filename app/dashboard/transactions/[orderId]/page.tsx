"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import GlassCard from "@/components/ui/GlassCard";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Badge from "@/components/ui/Badge";
import ButtonPrimary, { buttonClass } from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import type { ProductReview, Transaction } from "@/lib/types";
import { Copy, Clock, CheckCircle2, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, Star, Undo2 } from "lucide-react";
import RefundRequestCard from "@/components/dashboard/RefundRequestCard";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

const statusColor: Record<string, "primary" | "secondary" | "tertiary" | "default"> = {
  PENDING_PAYMENT: "tertiary",
  PAID: "secondary",
  PROCESSING: "tertiary",
  AWAITING_RETRY: "tertiary",
  COMPLETED: "secondary",
  FAILED: "primary",
  REJECTED: "primary",
  REFUNDED: "primary",
  EXPIRED: "primary",
  completed: "secondary",
  processing: "tertiary",
  failed: "primary",
};

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Bayar",
  PAID: "Menunggu Verifikasi",
  PROCESSING: "Diproses",
  AWAITING_RETRY: "Diproses",
  COMPLETED: "Selesai",
  FAILED: "Gagal",
  REJECTED: "Ditolak",
  REFUNDED: "Direfund",
  EXPIRED: "Kadaluarsa",
};

// Orders a customer may raise a refund/complaint about (paid and not already closed).
const COMPLAINT_STATUSES = ["PROCESSING", "AWAITING_RETRY", "COMPLETED"];

function complaintMessage(tx: Transaction, opening: string, extra: string[] = []) {
  return [
    opening,
    "",
    `ID pesanan: ${tx.order_id}`,
    `Produk: ${tx.productName} - ${tx.variantName}`,
    `Tanggal: ${formatDate(tx.created_at)}`,
    `Total: ${formatPrice(tx.total_amount ?? 0)}`,
    `Status: ${statusLabel[tx.db_status] ?? tx.db_status}`,
    ...extra,
    "",
    "Kendala: ",
  ].join("\n");
}

const PASSWORD_KEYS = ["password", "pass", "pwd", "sandi", "pin", "secret", "token"];

function isPasswordField(label: unknown): boolean {
  if (typeof label !== "string" || !label) return false;
  return PASSWORD_KEYS.some((k) => label.toLowerCase().includes(k));
}

interface Credential {
  label: string;
  value: string;
}

interface AccountGroup {
  title: string;
  credentials: Credential[];
}

function parseCredentials(arr: unknown[]): Credential[] {
  return arr.flatMap((c) => {
    if (c == null || typeof c !== "object") return [];
    const co = c as Record<string, unknown>;
    const label = typeof co.label === "string" ? co.label : String(co.label ?? "");
    const value = co.value != null ? String(co.value) : "";
    return label && value ? [{ label, value }] : [];
  });
}

function parseAccountDetails(raw: unknown): AccountGroup[] {
  const arr = Array.isArray(raw) ? raw : raw != null ? [raw] : [];

  return arr.flatMap((item) => {
    if (item == null || typeof item !== "object") return [];
    const obj = item as Record<string, unknown>;

    // Shape: {product, details: [{title, credentials}]}
    if (Array.isArray(obj.details)) {
      return parseAccountDetails(obj.details);
    }

    // Shape: {title, credentials: [{label, value}]}
    if (typeof obj.title === "string" && Array.isArray(obj.credentials)) {
      return [{ title: obj.title, credentials: parseCredentials(obj.credentials) }];
    }

    // Shape: flat {label, value}
    if (typeof obj.label === "string" && obj.value != null) {
      return [{ title: "", credentials: [{ label: obj.label, value: String(obj.value) }] }];
    }

    // Shape: flat record — only scalar values
    const creds: Credential[] = Object.entries(obj)
      .filter(([, v]) => v != null && v !== "" && typeof v !== "object")
      .map(([k, v]) => ({ label: k.replace(/_/g, " "), value: String(v) }));
    return creds.length ? [{ title: "", credentials: creds }] : [];
  });
}

function CredentialRow({ item }: { item: Credential }) {
  const [revealed, setRevealed] = useState(false);
  const isPass = isPasswordField(item.label);

  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] bg-card px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold capitalize text-muted">{item.label}</div>
        <div className="break-all font-mono text-sm font-semibold text-ink">
          {isPass && !revealed ? "••••••••" : item.value}
        </div>
      </div>
      {isPass && (
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          aria-pressed={revealed}
          aria-label={revealed ? `Sembunyikan ${item.label}` : `Tampilkan ${item.label}`}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-pill text-ink kr-press hover:bg-pill-hover"
        >
          {revealed ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        </button>
      )}
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(item.value)}
        aria-label={`Salin ${item.label}`}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-pill text-ink kr-press hover:bg-pill-hover"
      >
        <Copy size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

function AccountDetailsPanel({ rawDetails }: { rawDetails: unknown }) {
  const groups = parseAccountDetails(rawDetails);

  if (groups.length === 0) {
    return (
      <pre className="whitespace-pre-wrap break-all font-mono text-xs text-muted">{JSON.stringify(rawDetails, null, 2)}</pre>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-3">
          {group.title && <div className="text-[13px] font-semibold text-muted">{group.title}</div>}
          {group.credentials.map((cred, ci) => (
            <CredentialRow key={`${gi}-${ci}`} item={cred} />
          ))}
        </div>
      ))}
    </div>
  );
}

function ProductReviewPanel({
  tx,
  onReviewCreated,
}: {
  tx: Transaction;
  onReviewCreated: (review: ProductReview) => void;
}) {
  const { addToast } = useToast();
  const [rating, setRating] = useState(5);
  const [testimonial, setTestimonial] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (tx.db_status !== "COMPLETED") return null;

  if (tx.review) {
    return (
      <GlassCard className="p-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Rating kamu</h2>
            <div className="flex items-center gap-1" role="img" aria-label={`${tx.review.rating} dari 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={16}
                  aria-hidden="true"
                  className={n <= tx.review!.rating ? "fill-warn text-warn" : "text-line"}
                />
              ))}
            </div>
          </div>
          <span className="text-xs text-muted">{formatDate(tx.review.createdAt)}</span>
        </div>
        <p className="text-sm leading-6 text-muted">{tx.review.testimonial}</p>
      </GlassCard>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: tx.order_id,
          rating,
          testimonial,
        }),
      });
      const data = await res.json();

      if (data.success) {
        onReviewCreated(data.data);
        setTestimonial("");
        addToast("Terima kasih, review kamu sudah tersimpan.", "success");
      } else {
        const msg = data.message ?? "Gagal menyimpan review.";
        setError(msg);
        addToast(msg, "error");
      }
    } catch {
      const msg = "Terjadi kesalahan. Coba lagi.";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlassCard className="p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <h2 className="mb-1 text-lg font-semibold">Beri ulasan</h2>
          <p className="text-[13px] text-muted">Bagikan pengalaman kamu setelah pembelian disetujui admin.</p>
        </div>

        <div>
          <div className="mb-2 text-[13px] font-semibold">Rating</div>
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating produk">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} bintang`}
                onClick={() => setRating(value)}
                className={`kr-press flex h-11 w-11 cursor-pointer items-center justify-center rounded-full ${
                  value <= rating ? "bg-warn-bg text-warn" : "bg-pill text-line hover:bg-pill-hover"
                }`}
              >
                <Star size={18} aria-hidden="true" className={value <= rating ? "fill-warn" : ""} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="testimonial" className="text-[13px] font-semibold">
              Testimoni
            </label>
            <span className="text-xs text-muted">{testimonial.length}/800</span>
          </div>
          <textarea
            id="testimonial"
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
            minLength={10}
            maxLength={800}
            rows={4}
            placeholder="Ceritakan pengalaman kamu memakai produk ini..."
            className="kr-field !h-auto resize-none py-3"
          />
        </div>

        {error && (
          <div role="alert" className="rounded-2xl bg-danger-bg px-4 py-3 text-[13px] font-medium text-danger">
            {error}
          </div>
        )}

        <ButtonPrimary type="submit" disabled={submitting || testimonial.trim().length < 10} className="kr-press w-full">
          {submitting ? "Menyimpan..." : "Kirim ulasan"}
        </ButtonPrimary>
      </form>
    </GlassCard>
  );
}

export default function TransactionDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [tx, setTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/transactions")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const found = (data.data as Transaction[]).find(
            (t) => t.order_id === orderId
          );
          if (found) setTx(found);
          else setError("Transaksi tidak ditemukan.");
        } else {
          setError(data.message ?? "Gagal memuat transaksi.");
        }
      })
      .catch(() => setError("Terjadi kesalahan."))
      .finally(() => setLoading(false));
  }, [orderId]);

  const hasAccountDetails =
    tx?.account_details != null &&
    (Array.isArray(tx.account_details)
      ? tx.account_details.length > 0
      : typeof tx.account_details === "object"
      ? Object.keys(tx.account_details as object).length > 0
      : false);

  const paymentLabel =
    { QRIS_GATEWAY: "QRIS", QRIS_BRIDGE: "QRIS", QRIS: "QRIS", BALANCE: "Saldo", REFERRAL_BALANCE: "Saldo Referensi", COUPON: "Kupon" }[tx?.paymentMethod ?? ""] ??
    "Transfer";

  return (
    <div className="flex flex-col gap-5 md:gap-7">
      <DashboardHeader
        title={tx?.productName ?? "Detail transaksi"}
        subtitle={tx ? `Pesanan #${tx.order_id}${tx.created_at ? ` · ${formatDate(tx.created_at)}` : ""}` : undefined}
      />

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Memuat transaksi">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="kr-shimmer h-20 w-full" radius="rounded-[20px]" />
          ))}
        </div>
      ) : error ? (
        <div role="alert" className="kr-fade-in rounded-[22px] bg-danger-bg px-6 py-4 text-sm font-medium text-danger">
          {error}
        </div>
      ) : tx ? (
        <>
          <div className="kr-fade-in flex flex-wrap items-center gap-2">
            <Badge color={statusColor[tx.db_status] ?? "default"}>{statusLabel[tx.db_status] ?? tx.db_status ?? "—"}</Badge>
            <Badge color="default">{tx.quantity}x</Badge>
            <span className="text-[13px] text-muted">
              Dibayar via {paymentLabel} · {tx.variantName} · {tx.duration} · {tx.type}
            </span>
          </div>

          <Reveal onMount stagger={0.06} className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            <RevealItem className="flex min-w-0 flex-1 flex-col gap-6">
              {hasAccountDetails ? (
                <GlassCard className="p-6 md:p-8">
                  <h2 className="mb-4 text-lg font-semibold md:text-2xl">Kredensial</h2>
                  <AccountDetailsPanel rawDetails={tx.account_details as unknown} />
                  <p className="mt-4 text-[13px] text-muted">Jaga kerahasiaan data akun. Jangan bagikan ke siapapun.</p>
                </GlassCard>
              ) : (tx.db_status === "PENDING_PAYMENT" || tx.db_status === "PAID") ? (
                <GlassCard className="p-6 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-warn-bg text-warn">
                    {tx.db_status === "PAID" ? <CheckCircle2 size={26} aria-hidden="true" /> : <Clock size={26} aria-hidden="true" />}
                  </div>
                  <div className="mb-1 text-base font-semibold">
                    {tx.db_status === "PAID" ? "Menunggu verifikasi admin" : "Menunggu pembayaran"}
                  </div>
                  <div className="mb-4 text-[13px] text-muted">
                    {tx.db_status === "PAID"
                      ? "Pembayaran kamu sedang dicek oleh admin. Biasanya selesai dalam 1–24 jam."
                      : "Selesaikan pembayaran untuk melanjutkan proses order."}
                  </div>
                  <Link href={`/order/${tx.db_order_id}`} className={`kr-press ${buttonClass("secondary", "sm")}`}>
                    {tx.db_status === "PAID" ? "Lihat detail order" : "Lihat instruksi bayar"} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </GlassCard>
              ) : (tx.db_status === "PROCESSING" || tx.db_status === "AWAITING_RETRY" || tx.status === "processing") ? (
                <GlassCard className="p-6 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-warn-bg text-warn">
                    <Loader2 size={26} aria-hidden="true" className="animate-spin" />
                  </div>
                  <div className="mb-1 text-base font-semibold">Akun sedang diproses</div>
                  <div className="text-[13px] text-muted">Detail akun akan muncul setelah order selesai diproses.</div>
                </GlassCard>
              ) : null}

              {tx.db_status === "REFUNDED" && (
                <GlassCard className="flex items-start gap-3 p-5 md:p-6">
                  <Undo2 size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-danger" />
                  <div>
                    <div className="text-base font-semibold">Pesanan direfund</div>
                    <p className="text-[13px] text-muted">
                      {tx.refund_amount != null
                        ? `Dana ${formatPrice(tx.refund_amount)} dikembalikan ke ${tx.refund_wallet === "REFERRAL" ? "saldo referensi" : "saldo"}`
                        : "Dana dikembalikan ke saldo"}
                      {tx.refunded_at ? ` pada ${formatDate(tx.refunded_at)}.` : "."}
                    </p>
                  </div>
                </GlassCard>
              )}

              <ProductReviewPanel
                tx={tx}
                onReviewCreated={(review) =>
                  setTx((current) => (current ? { ...current, review } : current))
                }
              />
            </RevealItem>

            <RevealItem className="flex flex-col gap-4 lg:w-[400px] lg:shrink-0">
              <GlassCard className="flex flex-col gap-4 p-5 md:p-7">
                <h2 className="text-xl font-semibold">Rincian pembayaran</h2>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted">Produk</span>
                  <span className="text-right font-semibold">{tx.productName}</span>
                </div>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted">Order ID</span>
                  <span className="flex min-w-0 items-center gap-1">
                    <span className="break-all text-right font-mono text-xs font-semibold">{tx.order_id}</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(tx.order_id)}
                      aria-label="Salin Order ID"
                      className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted kr-press hover:text-ink"
                    >
                      <Copy size={14} aria-hidden="true" />
                    </button>
                  </span>
                </div>
                <div className="flex justify-between gap-3 border-t border-hairline pt-4 text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-[22px] font-bold leading-none">{formatPrice(tx.total_amount ?? 0)}</span>
                </div>
                <Link href="/dashboard/transactions" className={`kr-press ${buttonClass("secondary")} w-full`}>
                  <ArrowLeft size={15} aria-hidden="true" /> Kembali ke Riwayat
                </Link>
              </GlassCard>

              {COMPLAINT_STATUSES.includes(tx.db_status) && (
                <RefundRequestCard orderId={tx.order_id} message={(opening, extra) => complaintMessage(tx, opening, extra)} />
              )}
            </RevealItem>
          </Reveal>
        </>
      ) : null}
    </div>
  );
}
