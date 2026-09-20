"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import GradientBorder from "@/components/ui/GradientBorder";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { TransactionSkeleton } from "@/components/ui/Skeleton";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { useToast } from "@/components/ui/ToastContext";
import type { ProductReview, Transaction } from "@/lib/types";
import { Hash, Package, KeyRound, Star, Copy, Clock, CheckCircle2, Loader2 } from "lucide-react";

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
  EXPIRED: "Kadaluarsa",
};

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

function CredentialRow({
  item,
}: {
  item: Credential;
}) {
  const [revealed, setRevealed] = useState(false);
  const isPass = isPasswordField(item.label);

  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[12px] text-foreground/40 capitalize flex-shrink-0 w-28">
        {item.label}
      </span>
      <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
        <span
          className={`text-[13px] font-mono text-foreground break-all text-right transition-all duration-200 ${
            isPass && !revealed ? "blur-sm select-none" : ""
          }`}
        >
          {item.value}
        </span>
        {isPass && (
          <button
            onClick={() => setRevealed((r) => !r)}
            className="text-[11px] text-foreground/30 hover:text-foreground transition-colors flex-shrink-0 cursor-pointer whitespace-nowrap"
          >
            {revealed ? "Sembunyikan" : "Lihat"}
          </button>
        )}
        <button
          onClick={() => navigator.clipboard.writeText(item.value)}
          className="text-foreground/30 hover:text-foreground/70 transition-colors flex-shrink-0 cursor-pointer"
          title="Salin"
        >
          <Copy size={13} />
        </button>
      </div>
    </div>
  );
}

function AccountDetailsPanel({ rawDetails }: { rawDetails: unknown }) {
  const groups = parseAccountDetails(rawDetails);

  if (groups.length === 0) {
    return (
      <GlassCard radius="rounded-2xl" className="p-5">
        <div className="text-[11px] font-semibold text-foreground/60 mb-2">Raw Data</div>
        <pre className="text-[11px] text-foreground/60 font-mono whitespace-pre-wrap break-all">
          {JSON.stringify(rawDetails, null, 2)}
        </pre>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((group, gi) => (
        <GlassCard key={gi} radius="rounded-2xl" className="p-5">
          {group.title && (
            <div className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-3">
              {group.title}
            </div>
          )}
          <div className="space-y-3">
            {group.credentials.map((cred, ci) => (
              <CredentialRow key={`${gi}-${ci}`} item={cred} />
            ))}
          </div>
        </GlassCard>
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
      <GlassCard radius="rounded-2xl" className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-2">
              <Star size={12} />
              Rating Kamu
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={16} className={n <= tx.review!.rating ? "text-tertiary fill-tertiary" : "text-foreground/15"} />
              ))}
              <span className="text-[12px] text-foreground/40 ml-1">{tx.review.rating}/5</span>
            </div>
          </div>
          <span className="text-[11px] text-foreground/25">
            {formatDate(tx.review.createdAt)}
          </span>
        </div>
        <p className="text-[13px] text-foreground/55 leading-6">{tx.review.testimonial}</p>
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
    <GradientBorder radius="rounded-2xl">
      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-2">
            <Star size={12} />
            Beri Rating Produk
          </div>
          <p className="text-[12px] text-foreground/35 leading-5">
            Bagikan pengalaman kamu setelah pembelian disetujui admin.
          </p>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-foreground/70 mb-2">Rating</label>
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating produk">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                onClick={() => setRating(value)}
                className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                  value <= rating
                    ? "border-tertiary/60 bg-tertiary/10 text-tertiary"
                    : "border-foreground/10 bg-foreground/[0.03] text-foreground/20 hover:text-foreground/50"
                }`}
              >
                <Star size={18} className={value <= rating ? "fill-tertiary" : ""} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="testimonial" className="text-[13px] font-semibold text-foreground/70">
              Testimoni
            </label>
            <span className="text-[11px] text-foreground/20">{testimonial.length}/800</span>
          </div>
          <textarea
            id="testimonial"
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
            minLength={10}
            maxLength={800}
            rows={4}
            placeholder="Ceritakan pengalaman kamu memakai produk ini..."
            className="w-full glass rounded-xl px-4 py-3 text-[13px] text-foreground placeholder-foreground/20 border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors bg-transparent resize-none"
          />
        </div>

        {error && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 text-[13px] font-medium text-primary">
            {error}
          </div>
        )}

        <ButtonPrimary
          type="submit"
          disabled={submitting || testimonial.trim().length < 10}
          className="w-full justify-center py-3 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Menyimpan..." : "Kirim Review"}
        </ButtonPrimary>
      </form>
    </GradientBorder>
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-[12px] text-foreground/30 mb-8">
        <Link href="/dashboard/transactions" className="hover:text-foreground transition-colors">
          Transaksi
        </Link>
        <span>/</span>
        <span className="text-foreground/60 font-mono truncate max-w-[200px]">{orderId}</span>
      </div>

      {loading ? (
        <TransactionSkeleton />
      ) : error ? (
        <div className="glass rounded-2xl px-6 py-4 border border-primary/30 text-primary text-[14px] mb-6">
          {error}
        </div>
      ) : tx ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-semibold text-foreground leading-tight tracking-tight mb-1">
                {tx.productName ?? "Detail Transaksi"}
              </h1>
              <div className="text-[13px] text-foreground/40 mb-2">
                {tx.variantName} · {tx.duration} · {tx.type}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge color={statusColor[tx.db_status] ?? "default"}>
                  {statusLabel[tx.db_status] ?? tx.db_status ?? "—"}
                </Badge>
                <Badge color="default">{tx.quantity}x</Badge>
                <Badge color="default">{{ QRIS_GATEWAY: "QRIS", QRIS: "QRIS", BALANCE: "Saldo", COUPON: "Kupon" }[tx.paymentMethod] ?? "Transfer"}</Badge>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[28px] font-semibold text-foreground">
                {formatPrice(tx.total_amount ?? 0)}
              </div>
              <div className="text-[12px] text-foreground/30 mt-1">
                {tx.created_at ? formatDate(tx.created_at) : "—"}
              </div>
            </div>
          </div>

          {/* Order ID */}
          <GlassCard radius="rounded-2xl" className="p-5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/60 mb-1">
              <Hash size={12} />
              Order ID
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-mono text-foreground break-all flex-1">
                {tx.order_id}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(tx.order_id)}
                className="text-foreground/30 hover:text-foreground/70 transition-colors flex-shrink-0 cursor-pointer"
              >
                <Copy size={14} />
              </button>
            </div>
          </GlassCard>

          {/* Products */}
          {Array.isArray(tx.products) && tx.products.length > 0 && (() => {
            // account_details may carry product name when products[] lacks it
            const adArr = Array.isArray(tx.account_details) ? tx.account_details : [];
            const adNames: string[] = adArr.map((ad) => {
              const o = ad as Record<string, unknown>;
              return typeof o?.product === "string" ? o.product : "";
            });
            return (
              <div>
                <h2 className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/60 mb-3 uppercase tracking-wider">
                  <Package size={12} />
                  Produk
                </h2>
                <div className="space-y-2">
                  {tx.products.map((p, i) => {
                    const name = p?.name || adNames[i] || adNames[0] || "—";
                    return (
                      <GradientBorder key={p?.id ?? name ?? i} radius="rounded-2xl">
                        <div className="p-4 flex items-center gap-4">
                          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[20px] flex-shrink-0">
                            {getCategoryIcon(p?.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-medium text-foreground">
                              {name}
                            </div>
                          </div>
                        </div>
                      </GradientBorder>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Account details */}
          {hasAccountDetails ? (
            <div>
              <h2 className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/60 mb-3 uppercase tracking-wider">
                <KeyRound size={12} />
                Detail Akun
              </h2>
              <AccountDetailsPanel rawDetails={tx.account_details as unknown} />
              <p className="text-[11px] text-foreground/20 mt-3">
                Jaga kerahasiaan data akun. Jangan bagikan ke siapapun.
              </p>
            </div>
          ) : (tx.db_status === "PENDING_PAYMENT" || tx.db_status === "PAID") ? (
            <GlassCard radius="rounded-2xl" className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-tertiary/15 text-tertiary flex items-center justify-center mx-auto mb-3">
                {tx.db_status === "PAID" ? <CheckCircle2 size={26} /> : <Clock size={26} />}
              </div>
              <div className="text-[14px] font-semibold text-foreground/70 mb-1">
                {tx.db_status === "PAID" ? "Menunggu verifikasi admin" : "Menunggu pembayaran"}
              </div>
              <div className="text-[12px] text-foreground/30 mb-4">
                {tx.db_status === "PAID"
                  ? "Pembayaran kamu sedang dicek oleh admin. Biasanya selesai dalam 1–24 jam."
                  : "Selesaikan pembayaran untuk melanjutkan proses order."}
              </div>
              <Link href={`/order/${tx.db_order_id}`}>
                <span className="text-[12px] font-medium text-foreground/60 hover:text-foreground transition-colors border border-foreground/20 rounded-xl px-4 py-2">
                  {tx.db_status === "PAID" ? "Lihat detail order →" : "Lihat instruksi bayar →"}
                </span>
              </Link>
            </GlassCard>
          ) : (tx.db_status === "PROCESSING" || tx.db_status === "AWAITING_RETRY" || tx.db_status === "PAID" || tx.status === "processing") ? (
            <GlassCard radius="rounded-2xl" className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-tertiary/15 text-tertiary flex items-center justify-center mx-auto mb-3">
                <Loader2 size={26} className="animate-spin" />
              </div>
              <div className="text-[14px] font-semibold text-foreground/70 mb-1">Akun sedang diproses</div>
              <div className="text-[12px] text-foreground/30">
                Detail akun akan muncul setelah order selesai diproses.
              </div>
            </GlassCard>
          ) : null}

          <ProductReviewPanel
            tx={tx}
            onReviewCreated={(review) =>
              setTx((current) => (current ? { ...current, review } : current))
            }
          />

          <div className="pt-2">
            <Link href="/dashboard/transactions">
              <ButtonPrimary variant="ghost" className="text-[13px]">
                ← Kembali ke Riwayat
              </ButtonPrimary>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
