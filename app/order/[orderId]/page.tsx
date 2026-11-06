"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import ButtonPrimary, { buttonClass } from "@/components/ui/ButtonPrimary";
import GatewayQr from "@/components/payment/GatewayQr";
import { Skeleton } from "@/components/ui/Skeleton";
import Countdown from "@/components/payment/Countdown";
import {
  Clock, CheckCircle2, Loader2, PartyPopper, XCircle, Ban, TimerOff, Package,
  Landmark, Copy, Check, Download, ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const statusInfo: Record<string, { label: string; color: "primary" | "secondary" | "tertiary" | "default"; icon: LucideIcon; spin?: boolean; desc: string }> = {
  PENDING_PAYMENT: { label: "Menunggu Pembayaran", color: "tertiary", icon: Clock, desc: "Selesaikan pembayaran sesuai instruksi di bawah. Admin akan verifikasi setelah dana masuk." },
  PAID:            { label: "Pembayaran Diterima", color: "secondary", icon: CheckCircle2, desc: "Pembayaran diterima. Sedang diproses." },
  PROCESSING:      { label: "Sedang Diproses", color: "tertiary", icon: Loader2, spin: true, desc: "Akun sedang disiapkan." },
  AWAITING_RETRY:  { label: "Sedang Diproses", color: "tertiary", icon: Loader2, spin: true, desc: "Akun sedang disiapkan." },
  COMPLETED:       { label: "Selesai", color: "secondary", icon: PartyPopper, desc: "Order selesai! Cek detail akun di riwayat transaksi." },
  FAILED:          { label: "Gagal", color: "primary", icon: XCircle, desc: "Terjadi masalah saat memproses order. Hubungi admin." },
  REJECTED:        { label: "Ditolak", color: "primary", icon: Ban, desc: "Order ditolak. Hubungi admin untuk informasi lebih lanjut." },
  EXPIRED:         { label: "Kadaluarsa", color: "primary", icon: TimerOff, desc: "QRIS kadaluarsa sebelum dibayar. Buat order baru untuk mencoba lagi." },
};

const toneClass = {
  primary: "bg-danger-bg text-danger",
  secondary: "bg-success-bg text-success",
  tertiary: "bg-warn-bg text-warn",
  default: "bg-pill text-muted",
};

interface Order {
  id: string;
  productName: string;
  variantName: string;
  duration: string;
  type: string;
  sellPrice: number;
  uniqueCode: number;
  quantity: number;
  status: string;
  paymentMethod: string;
  paymentRef: string | null;
  paymentNote: string | null;
  apiOrderId: string | null;
  gatewayQrString: string | null;
  gatewayExpiresAt: string | null;
  bridgePaymentUrl: string | null;
  bridgeExpiresAt: string | null;
  createdAt: string;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Salin ${label}`}
      className="kr-press inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-pill hover:text-ink"
    >
      {copied ? <Check size={18} className="kr-fade-in text-success" /> : <Copy size={18} />}
    </button>
  );
}

function PaymentInstructions({ order }: { order: Order }) {
  const totalAmount = order.sellPrice + order.uniqueCode;
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME ?? "BCA";
  const bankNumber = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? "-";
  const bankHolder = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? "-";
  const isQris = order.paymentMethod === "QRIS_GATEWAY" || order.paymentMethod === "QRIS_BRIDGE" || order.paymentMethod === "QRIS";
  const heading = isQris ? "Scan untuk membayar" : "Transfer untuk membayar";
  const amountLabel = order.paymentMethod === "QRIS_GATEWAY" || order.paymentMethod === "QRIS_BRIDGE"
    ? "Total pembayaran"
    : order.paymentMethod === "QRIS"
    ? "Nominal QRIS"
    : "Transfer tepat sebesar";

  return (
    <section className="kr-fade-up flex min-w-0 flex-1 flex-col items-center gap-5 rounded-[28px] bg-surface p-6 text-center shadow-card md:rounded-[36px] md:p-10">
      <Badge color="tertiary">Menunggu pembayaran</Badge>
      <h2 className="text-[26px] font-bold tracking-tight text-ink md:text-4xl">{heading}</h2>

      {order.paymentMethod === "QRIS_GATEWAY" && (
        <>
          {order.gatewayQrString ? (
            <div className="kr-fade-up" style={{ animationDelay: "150ms" }}>
              <GatewayQr value={order.gatewayQrString} className="h-[240px] w-[240px] md:h-[280px] md:w-[280px]" />
            </div>
          ) : (
            <div className="flex h-[240px] w-[240px] items-center justify-center rounded-[20px] border-2 border-ink bg-white p-3 text-xs text-[#5B5F66] md:h-[280px] md:w-[280px]">QR tidak tersedia</div>
          )}
          {order.gatewayExpiresAt && (
            <div className="kr-fade-in" style={{ animationDelay: "250ms" }}>
              <Countdown expiresAt={order.gatewayExpiresAt} />
            </div>
          )}
        </>
      )}

      {order.paymentMethod === "QRIS_BRIDGE" && (
        <>
          {order.bridgePaymentUrl && (
            <a href={order.bridgePaymentUrl} target="_blank" rel="noopener noreferrer" className={`${buttonClass()} w-full max-w-sm`}>
              Lanjutkan pembayaran <ArrowRight size={16} aria-hidden="true" />
            </a>
          )}
          {order.bridgeExpiresAt && (
            <div className="kr-fade-in" style={{ animationDelay: "250ms" }}>
              <Countdown expiresAt={order.bridgeExpiresAt} />
            </div>
          )}
        </>
      )}

      {order.paymentMethod === "QRIS" && (
        <>
          <div className="kr-fade-up rounded-[20px] border-2 border-ink bg-white p-3" style={{ animationDelay: "150ms" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/qris.png" alt="QRIS KampusRebahan" className="h-[240px] w-[240px] object-contain md:h-[280px] md:w-[280px]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">KampusRebahan</div>
            <div className="text-[13px] text-muted">NMID: ID1026520725130</div>
          </div>
          <a href="/qris.png" download="QRIS-KampusRebahan.png" className={buttonClass("secondary", "sm")}>
            <Download size={14} aria-hidden="true" /> Download QRIS
          </a>
        </>
      )}

      {!isQris && (
        <dl className="flex w-full max-w-sm flex-col gap-3 text-left">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-card px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs font-semibold text-muted"><Landmark size={14} aria-hidden="true" /> Bank</dt>
            <dd className="text-sm font-medium text-ink">{bankName}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-card py-1 pl-4 pr-1">
            <dt className="text-xs font-semibold text-muted">No. Rekening</dt>
            <dd className="flex items-center gap-1">
              <span className="font-mono text-sm font-medium text-ink">{bankNumber}</span>
              <CopyButton value={bankNumber} label="nomor rekening" />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-card px-4 py-3">
            <dt className="text-xs font-semibold text-muted">Atas Nama</dt>
            <dd className="text-sm font-medium text-ink">{bankHolder}</dd>
          </div>
        </dl>
      )}

      <div>
        <div className="text-[13px] font-semibold text-muted">{amountLabel}</div>
        <div className="flex items-center justify-center gap-1">
          <span className="text-[28px] font-bold text-ink md:text-[32px]">{formatPrice(totalAmount)}</span>
          <CopyButton value={String(totalAmount)} label="nominal" />
        </div>
        {order.uniqueCode > 0 && (
          <div className="text-[13px] text-muted">
            Harga produk {formatPrice(order.sellPrice)} + <span className="font-semibold text-warn">{order.uniqueCode} (kode unik)</span>
          </div>
        )}
      </div>

      {!isQris && (
        <ul className="w-full max-w-sm list-inside list-disc space-y-1 rounded-2xl bg-warn-bg px-4 py-3 text-left text-[13px] font-medium text-warn">
          <li>Transfer nominal <strong>tepat</strong> termasuk kode unik.</li>
          <li>Admin akan verifikasi otomatis berdasarkan jumlah yang masuk.</li>
          <li><strong>Kesalahan nominal</strong> bukan tanggung jawab kami dan tidak terdapat pengembalian dana.</li>
        </ul>
      )}
    </section>
  );
}

function OrderSummary({ order }: { order: Order }) {
  const rows: [string, string][] = [
    ["Order", `#${order.id}`],
    ["Produk", order.productName],
    ["Varian", `${order.variantName} · ${order.duration} · ${order.type}`],
    ["Jumlah", String(order.quantity)],
    ["Metode", { QRIS_GATEWAY: "QRIS Otomatis (Bayar.gg)", QRIS_BRIDGE: "QRIS Instan (Bridge)", QRIS: "QRIS", BALANCE: "Saldo", COUPON: "Kupon Loyalitas" }[order.paymentMethod] ?? "Transfer Bank"],
    ["Tanggal", formatDate(order.createdAt)],
  ];
  if (order.paymentRef) rows.push(["Ref Transfer", order.paymentRef]);
  if (order.paymentNote) rows.push(["Catatan", order.paymentNote]);

  return (
    <section className="kr-fade-up rounded-[28px] bg-surface p-5 shadow-card md:p-7" style={{ animationDelay: "80ms" }}>
      <h2 className="mb-4 text-xl font-semibold text-ink">Ringkasan</h2>
      <dl className="flex flex-col gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <dt className="shrink-0 text-muted">{label}</dt>
            <dd className="break-all text-right font-medium text-ink">{value}</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-3">
          <dt className="text-sm font-semibold text-ink">Total</dt>
          <dd className="text-xl font-bold text-ink">{formatPrice(order.sellPrice + order.uniqueCode)}</dd>
        </div>
      </dl>
    </section>
  );
}

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");

  useEffect(() => {
    fetch(`/api/order/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setOrder(data.data);
        else setError(data.message ?? "Order tidak ditemukan.");
      })
      .catch(() => setError("Terjadi kesalahan."))
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    if (!order || order.status !== "PENDING_PAYMENT") return;
    if (order.paymentMethod !== "QRIS_GATEWAY" && order.paymentMethod !== "QRIS_BRIDGE") return;

    const statusEndpoint = order.paymentMethod === "QRIS_GATEWAY" ? "gateway-status" : "bridge-status";

    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/order/${orderId}/${statusEndpoint}`);
        const data = await res.json();
        if (data.success && data.data?.status && data.data.status !== "pending") {
          const orderRes = await fetch(`/api/order/${orderId}`);
          const orderData = await orderRes.json();
          if (orderData.success) setOrder(orderData.data);
        }
      } catch {
        // ignore transient polling errors, retry on next tick
      }
    }, 5000);

    return () => clearInterval(id);
  }, [order, orderId]);

  async function handleConfirmPayment() {
    if (!orderId || confirming) return;
    setConfirming(true);
    setConfirmMsg("");
    try {
      const res = await fetch(`/api/order/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm_payment" }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
        setConfirmMsg("Terima kasih! Admin akan segera memverifikasi pembayaran kamu.");
      } else {
        setConfirmMsg(data.message ?? "Gagal mengupdate status.");
      }
    } catch {
      setConfirmMsg("Terjadi kesalahan. Coba lagi.");
    } finally {
      setConfirming(false);
    }
  }

  const info = order
    ? (statusInfo[order.status] ?? { label: order.status, color: "default" as const, icon: Package, desc: "" })
    : null;
  const isPending = order?.status === "PENDING_PAYMENT";
  const isAutoQris = order?.paymentMethod === "QRIS_GATEWAY" || order?.paymentMethod === "QRIS_BRIDGE";

  return (
    <div className="kr-page">
      <Navbar />
      <main className="flex-1 py-8 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[13px] text-muted">
          <Link href="/dashboard/transactions" className="hover:text-ink hover:underline">Transaksi</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="max-w-[160px] truncate font-mono font-semibold text-ink">{orderId}</span>
        </nav>

        {loading ? (
          <div role="status" aria-label="Memuat pesanan" className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
            <div className="flex min-h-[420px] flex-1 flex-col items-center gap-5 rounded-[28px] bg-surface p-6 shadow-card md:rounded-[36px] md:p-10">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-9 w-64" />
              <Skeleton radius="rounded-[20px]" className="h-[240px] w-[240px] md:h-[280px] md:w-[280px]" />
            </div>
            <div className="flex w-full flex-col gap-3 rounded-[28px] bg-surface p-5 shadow-card md:p-7 lg:w-[420px] lg:shrink-0">
              <Skeleton className="mb-2 h-6 w-32" />
              {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-4 w-full" />)}
            </div>
          </div>
        ) : error ? (
          <div role="alert" className="kr-fade-in rounded-2xl bg-danger-bg px-6 py-4 text-sm font-medium text-danger">{error}</div>
        ) : order && info ? (
          isPending ? (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
              <h1 className="sr-only">Status pesanan</h1>
              <PaymentInstructions order={order} />
              <div className="flex w-full flex-col gap-5 lg:w-[420px] lg:shrink-0">
                <OrderSummary order={order} />
                {isAutoQris ? null : confirmMsg ? (
                  <div role="status" className="kr-fade-in rounded-2xl bg-success-bg px-4 py-3 text-center text-[13px] font-medium text-success">
                    {confirmMsg}
                  </div>
                ) : (
                  <ButtonPrimary type="button" onClick={handleConfirmPayment} disabled={confirming} className="w-full">
                    {confirming ? "Memproses..." : "Sudah bayar"}
                  </ButtonPrimary>
                )}
                <p className="text-[13px] text-muted">
                  {isAutoQris
                    ? "Halaman ini diperbarui otomatis setelah pembayaran terdeteksi."
                    : "Admin akan memverifikasi setelah dana masuk."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <header className="kr-fade-up flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="min-w-0">
                  <p className="break-all text-sm font-medium text-muted">Pesanan #{order.id}</p>
                  <h1 className="text-4xl font-bold tracking-[-1.5px] text-ink md:text-[56px] md:tracking-[-2.5px]">{order.productName}</h1>
                </div>
                <div className="shrink-0"><Badge color={info.color}>{info.label}</Badge></div>
              </header>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
                <section className="kr-fade-up flex min-w-0 flex-1 items-start gap-4 rounded-[24px] bg-surface p-5 shadow-card md:rounded-[32px] md:p-8" style={{ animationDelay: "80ms" }}>
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-full ${toneClass[info.color]}`} aria-hidden="true">
                    <info.icon size={24} className={info.spin ? "animate-spin" : ""} />
                  </div>
                  <div className="flex min-w-0 flex-col gap-4">
                    <div>
                      <h2 className="text-[22px] font-semibold text-ink">{info.label}</h2>
                      <p className="text-sm text-muted">{info.desc}</p>
                    </div>
                    {order.status === "COMPLETED" && order.apiOrderId && (
                      <Link href={`/dashboard/transactions/${order.id}`} className={`${buttonClass()} self-start`}>
                        Lihat detail akun <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </section>
                <div className="w-full lg:w-[420px] lg:shrink-0"><OrderSummary order={order} /></div>
              </div>

              <div>
                <Link href="/dashboard/transactions" className={buttonClass("secondary")}>Kembali ke riwayat</Link>
              </div>
            </div>
          )
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
