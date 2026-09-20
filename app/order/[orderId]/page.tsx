"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassCard from "@/components/ui/GlassCard";
import GradientBorder from "@/components/ui/GradientBorder";
import Badge from "@/components/ui/Badge";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import GatewayQr from "@/components/payment/GatewayQr";
import Countdown from "@/components/payment/Countdown";
import {
  Clock, CheckCircle2, Loader2, PartyPopper, XCircle, Ban, TimerOff, Package,
  ListChecks, CreditCard, Landmark, Copy, Check, Download,
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
  createdAt: string;
}

function CopyButton({ value }: { value: string; label?: string }) {
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
      className="text-foreground/30 hover:text-foreground/70 transition-colors cursor-pointer"
    >
      {copied ? <Check size={14} className="text-secondary" /> : <Copy size={14} />}
    </button>
  );
}

function PaymentInstructions({ order }: { order: Order }) {
  const totalAmount = order.sellPrice + order.uniqueCode;
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME ?? "BCA";
  const bankNumber = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? "-";
  const bankHolder = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? "-";

  return (
    <GradientBorder radius="rounded-2xl">
      <div className="p-5 space-y-5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/60 uppercase tracking-wider">
          <CreditCard size={12} />
          Instruksi Pembayaran
        </div>

        <div className="border-t border-foreground/8 pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-medium text-foreground/60">
              {order.paymentMethod === "QRIS_GATEWAY" ? "Total Pembayaran" : order.paymentMethod === "QRIS" ? "Nominal QRIS" : "Transfer tepat sebesar"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[24px] font-bold text-foreground">{formatPrice(totalAmount)}</span>
              <CopyButton value={String(totalAmount)} />
            </div>
          </div>
          {order.uniqueCode > 0 && (
            <div className="text-[11px] text-foreground/30">
              Harga produk <span className="text-foreground/50">{formatPrice(order.sellPrice)}</span> + <span className="text-tertiary font-semibold">+{order.uniqueCode} (Kode Unik)</span>
            </div>
          )}
        </div>

        {order.paymentMethod !== "QRIS_GATEWAY" && (
          <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl px-3 py-2.5 text-[11px] font-medium text-tertiary/80">
            <ul className="list-disc list-inside space-y-1">
              <li>Transfer nominal <strong>tepat</strong> termasuk kode unik.</li>
              <li>Admin akan verifikasi otomatis berdasarkan jumlah yang masuk.</li>
              <li><strong>Kesalahan nominal</strong> bukan tanggung jawab kami dan tidak terdapat pengembalian dana.</li>
            </ul>
          </div>
        )}

        {order.paymentMethod === "QRIS_GATEWAY" ? (
          <div className="text-center space-y-3">
            <div className="text-[13px] font-medium text-foreground/60">Scan QR code berikut</div>
            <div className="inline-block bg-white p-3 rounded-xl">
              {order.gatewayQrString ? (
                <GatewayQr value={order.gatewayQrString} />
              ) : (
                <div className="w-72 h-72 flex items-center justify-center text-black/40 text-[12px]">QR tidak tersedia</div>
              )}
            </div>
            {order.gatewayExpiresAt && (
              <div className="text-[12px] text-foreground/40">
                Kadaluarsa dalam <span className="text-tertiary font-semibold"><Countdown expiresAt={order.gatewayExpiresAt} /></span>
              </div>
            )}
            <div className="text-[11px] text-foreground/30">Status pembayaran akan otomatis terupdate begitu QRIS ini dibayar.</div>
          </div>
        ) : order.paymentMethod === "QRIS" ? (
          <div className="text-center space-y-3">
            <div className="text-[13px] font-medium text-foreground/60">Scan QR code berikut</div>
            <div className="inline-block bg-white p-3 rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/qris.png" alt="QRIS KampusRebahan" className="w-72 h-72 object-contain" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[13px] font-semibold text-foreground">KampusRebahan</div>
              <div className="text-[11px] text-foreground/40">NMID: ID1026520725130</div>
            </div>
            <a
              href="/qris.png"
              download="QRIS-KampusRebahan.png"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground/50 hover:text-foreground border border-foreground/15 hover:border-foreground/30 rounded-xl px-4 py-2 transition-colors"
            >
              <Download size={14} /> Download QRIS
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground/50"><Landmark size={13} /> Bank</span>
              <span className="text-[14px] font-medium text-foreground">{bankName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium text-foreground/50">No. Rekening</span>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-mono font-semibold text-foreground">{bankNumber}</span>
                <CopyButton value={bankNumber} />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] font-medium text-foreground/50">Atas Nama</span>
              <span className="text-[14px] text-foreground">{bankHolder}</span>
            </div>
          </div>
        )}
      </div>
    </GradientBorder>
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
    if (!order || order.paymentMethod !== "QRIS_GATEWAY" || order.status !== "PENDING_PAYMENT") return;

    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/order/${orderId}/gateway-status`);
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

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-2 text-[12px] text-foreground/30 mb-8">
            <Link href="/dashboard/transactions" className="hover:text-foreground transition-colors">Transaksi</Link>
            <span>/</span>
            <span className="text-foreground/60 font-mono truncate max-w-[160px]">{orderId}</span>
          </div>

          {loading ? (
            <div className="text-foreground/30 text-[14px]">Memuat...</div>
          ) : error ? (
            <div className="glass rounded-2xl px-6 py-4 border border-primary/30 text-primary text-[14px]">{error}</div>
          ) : order && info ? (
            <div className="space-y-5">
              <div className="text-center py-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  info.color === "primary" ? "bg-primary/15 text-primary" :
                  info.color === "secondary" ? "bg-secondary/15 text-secondary" :
                  info.color === "tertiary" ? "bg-tertiary/15 text-tertiary" :
                  "bg-foreground/10 text-foreground/60"
                }`}>
                  <info.icon size={30} className={info.spin ? "animate-spin" : ""} />
                </div>
                <Badge color={info.color}>{info.label}</Badge>
                <p className="text-[13px] text-foreground/40 mt-3 max-w-sm mx-auto">{info.desc}</p>
              </div>

              <GlassCard radius="rounded-2xl" className="p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-1">
                  <ListChecks size={12} />
                  Detail Order
                </div>
                {([
                  ["Produk", order.productName],
                  ["Varian", `${order.variantName} · ${order.duration} · ${order.type}`],
                  ["Jumlah", String(order.quantity)],
                  ["Metode", order.paymentMethod === "QRIS_GATEWAY" ? "QRIS Otomatis (Bayar.gg)" : order.paymentMethod === "QRIS" ? "QRIS" : "Transfer Bank"],
                  ["Tanggal", formatDate(order.createdAt)],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-[12px] font-medium text-foreground/50 flex-shrink-0">{label}</span>
                    <span className="text-[13px] text-foreground text-right break-all">{value}</span>
                  </div>
                ))}
                {order.paymentRef && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[12px] text-foreground/40 flex-shrink-0">Ref Transfer</span>
                    <span className="text-[13px] text-foreground text-right font-mono">{order.paymentRef}</span>
                  </div>
                )}
                {order.paymentNote && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[12px] text-foreground/40 flex-shrink-0">Catatan</span>
                    <span className="text-[13px] text-foreground/60 text-right">{order.paymentNote}</span>
                  </div>
                )}
              </GlassCard>

              {order.status === "PENDING_PAYMENT" && (
                <>
                  <PaymentInstructions order={order} />
                  {order.paymentMethod === "QRIS_GATEWAY" ? (
                    <div className="text-center text-[12px] text-foreground/30">
                      Menunggu pembayaran... status akan terupdate otomatis.
                    </div>
                  ) : confirmMsg ? (
                    <div className="bg-secondary/10 border border-secondary/30 rounded-xl px-4 py-3 text-[13px] font-medium text-secondary text-center">
                      {confirmMsg}
                    </div>
                  ) : (
                    <ButtonPrimary
                      type="button"
                      onClick={handleConfirmPayment}
                      disabled={confirming}
                      className="w-full py-3 text-[14px] flex items-center justify-center gap-2"
                    >
                      {!confirming && <CheckCircle2 size={16} />}
                      {confirming ? "Memproses..." : "Sudah Bayar"}
                    </ButtonPrimary>
                  )}
                </>
              )}

              {order.status === "COMPLETED" && order.apiOrderId && (
                <div className="text-center">
                  <Link href={`/dashboard/transactions/${order.id}`}>
                    <ButtonPrimary>Lihat Detail Akun →</ButtonPrimary>
                  </Link>
                </div>
              )}

              <div className="pt-2">
                <Link href="/dashboard/transactions">
                  <ButtonPrimary variant="ghost" className="text-[13px]">← Kembali ke Riwayat</ButtonPrimary>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
