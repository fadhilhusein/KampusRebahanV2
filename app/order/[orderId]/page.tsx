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

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const statusInfo: Record<string, { label: string; color: "primary" | "secondary" | "tertiary" | "default"; icon: string; desc: string }> = {
  PENDING_PAYMENT: { label: "Menunggu Pembayaran", color: "tertiary", icon: "⏳", desc: "Selesaikan pembayaran sesuai instruksi di bawah. Admin akan verifikasi setelah dana masuk." },
  PAID:            { label: "Pembayaran Diterima", color: "secondary", icon: "✅", desc: "Pembayaran diterima. Sedang diproses." },
  PROCESSING:      { label: "Sedang Diproses", color: "tertiary", icon: "⚙️", desc: "Akun sedang disiapkan." },
  COMPLETED:       { label: "Selesai", color: "secondary", icon: "🎉", desc: "Order selesai! Cek detail akun di riwayat transaksi." },
  FAILED:          { label: "Gagal", color: "primary", icon: "❌", desc: "Terjadi masalah saat memproses order. Hubungi admin." },
  REJECTED:        { label: "Ditolak", color: "primary", icon: "🚫", desc: "Order ditolak. Hubungi admin untuk informasi lebih lanjut." },
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
  createdAt: string;
}

function CopyButton({ value, label = "Salin" }: { value: string; label?: string }) {
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
      className="text-[11px] text-white/30 hover:text-white transition-colors cursor-pointer"
    >
      {copied ? "✓" : label}
    </button>
  );
}

function PaymentInstructions({ order }: { order: Order }) {
  const totalAmount = order.sellPrice + order.uniqueCode;
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME ?? "BCA";
  const bankNumber = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? "-";
  const bankHolder = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? "-";

  return (
    <GradientBorder>
      <div className="p-5 space-y-5">
        <div className="text-[11px] text-white/30 uppercase tracking-wider">Instruksi Pembayaran</div>

        <div className="border-t border-white/8 pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-white/50">
              {order.paymentMethod === "QRIS" ? "Nominal QRIS" : "Transfer tepat sebesar"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[24px] font-bold text-white">{formatPrice(totalAmount)}</span>
              <CopyButton value={String(totalAmount)} />
            </div>
          </div>
          <div className="text-[11px] text-white/30">
            Harga produk <span className="text-white/50">{formatPrice(order.sellPrice)}</span> + <span className="text-tertiary font-semibold">+{order.uniqueCode} (Kode Unik)</span>
          </div>
        </div>

        <div className="bg-tertiary/10 border border-tertiary/20 rounded-[2px] px-3 py-2.5 text-[11px] text-tertiary/80">
          <ul className="list-disc list-inside space-y-1">
            <li>Transfer nominal <strong>tepat</strong> termasuk kode unik.</li>
            <li>Admin akan verifikasi otomatis berdasarkan jumlah yang masuk.</li>
            <li><strong>Kesalahan nominal</strong> bukan tanggung jawab kami dan tidak terdapat pengembalian dana.</li>
          </ul>
        </div>

        {order.paymentMethod === "QRIS" ? (
          <div className="text-center space-y-3">
            <div className="text-[13px] text-white/50">Scan QR code berikut</div>
            <div className="inline-block bg-white p-3 rounded-[4px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/qris.png" alt="QRIS KampusRebahan" className="w-52 h-52 object-contain" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[13px] font-semibold text-white">KampusRebahan</div>
              <div className="text-[11px] text-white/40">NMID: ID1026520725130</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[12px] text-white/40">Bank</span>
              <span className="text-[14px] font-medium text-white">{bankName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-white/40">No. Rekening</span>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-mono font-semibold text-white">{bankNumber}</span>
                <CopyButton value={bankNumber} />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-white/40">Atas Nama</span>
              <span className="text-[14px] text-white">{bankHolder}</span>
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
    ? (statusInfo[order.status] ?? { label: order.status, color: "default" as const, icon: "📦", desc: "" })
    : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-2 text-[12px] text-white/30 mb-8">
            <Link href="/transactions" className="hover:text-white transition-colors">Transaksi</Link>
            <span>/</span>
            <span className="text-white/60 font-mono truncate max-w-[160px]">{orderId}</span>
          </div>

          {loading ? (
            <div className="text-white/30 text-[14px]">Memuat...</div>
          ) : error ? (
            <div className="glass rounded-[2px] px-6 py-4 border border-primary/30 text-primary text-[14px]">{error}</div>
          ) : order && info ? (
            <div className="space-y-5">
              <div className="text-center py-8">
                <div className="text-[48px] mb-3">{info.icon}</div>
                <Badge color={info.color}>{info.label}</Badge>
                <p className="text-[13px] text-white/40 mt-3 max-w-sm mx-auto">{info.desc}</p>
              </div>

              <GlassCard className="p-5 space-y-3">
                <div className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Detail Order</div>
                {([
                  ["Produk", order.productName],
                  ["Varian", `${order.variantName} · ${order.duration} · ${order.type}`],
                  ["Jumlah", String(order.quantity)],
                  ["Metode", order.paymentMethod === "QRIS" ? "QRIS" : "Transfer Bank"],
                  ["Tanggal", formatDate(order.createdAt)],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-[12px] text-white/40 flex-shrink-0">{label}</span>
                    <span className="text-[13px] text-white text-right break-all">{value}</span>
                  </div>
                ))}
                {order.paymentRef && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[12px] text-white/40 flex-shrink-0">Ref Transfer</span>
                    <span className="text-[13px] text-white text-right font-mono">{order.paymentRef}</span>
                  </div>
                )}
                {order.paymentNote && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[12px] text-white/40 flex-shrink-0">Catatan</span>
                    <span className="text-[13px] text-white/60 text-right">{order.paymentNote}</span>
                  </div>
                )}
              </GlassCard>

              {order.status === "PENDING_PAYMENT" && (
                <>
                  <PaymentInstructions order={order} />
                  {confirmMsg ? (
                    <div className="bg-secondary/10 border border-secondary/30 rounded-[2px] px-4 py-3 text-[13px] text-secondary text-center">
                      {confirmMsg}
                    </div>
                  ) : (
                    <ButtonPrimary
                      type="button"
                      onClick={handleConfirmPayment}
                      disabled={confirming}
                      className="w-full py-3 text-[14px]"
                    >
                      {confirming ? "Memproses..." : "✓ Sudah Bayar"}
                    </ButtonPrimary>
                  )}
                </>
              )}

              {order.status === "COMPLETED" && order.apiOrderId && (
                <div className="text-center">
                  <Link href={`/transactions/${order.apiOrderId}`}>
                    <ButtonPrimary>Lihat Detail Akun →</ButtonPrimary>
                  </Link>
                </div>
              )}

              <div className="pt-2">
                <Link href="/transactions">
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
