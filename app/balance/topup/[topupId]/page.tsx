"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientBorder from "@/components/ui/GradientBorder";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import GatewayQr from "@/components/payment/GatewayQr";
import Countdown from "@/components/payment/Countdown";
import { useToast } from "@/components/ui/ToastContext";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

interface TopUp {
  id: string;
  amount: number;
  status: string;
  gatewayQrString: string | null;
  gatewayExpiresAt: string | null;
}

export default function TopUpPaymentPage() {
  const { topupId } = useParams<{ topupId: string }>();
  const router = useRouter();
  const { addToast } = useToast();

  const [topup, setTopup] = useState<TopUp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/balance/topup/${topupId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTopup(data.data);
        else setError(data.message ?? "Top up tidak ditemukan.");
      })
      .catch(() => setError("Terjadi kesalahan."))
      .finally(() => setLoading(false));
  }, [topupId]);

  useEffect(() => {
    if (!topup || topup.status !== "PENDING") return;

    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/balance/topup/${topupId}/status`);
        const data = await res.json();
        if (data.success && data.data?.status === "paid") {
          addToast("Saldo berhasil ditambahkan!", "success");
          router.push("/balance");
        } else if (data.success && data.data?.status && ["expired", "cancelled"].includes(data.data.status)) {
          const topupRes = await fetch(`/api/balance/topup/${topupId}`);
          const topupData = await topupRes.json();
          if (topupData.success) setTopup(topupData.data);
        }
      } catch {
        // ignore transient polling errors, retry on next tick
      }
    }, 5000);

    return () => clearInterval(id);
  }, [topup, topupId, router, addToast]);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-2 text-[12px] text-white/30 mb-8">
            <Link href="/balance" className="hover:text-white transition-colors">Saldo</Link>
            <span>/</span>
            <span className="text-white/60">Top Up</span>
          </div>

          {loading ? (
            <div className="text-white/30 text-[14px]">Memuat...</div>
          ) : error ? (
            <div className="glass rounded-[2px] px-6 py-4 border border-primary/30 text-primary text-[14px]">{error}</div>
          ) : topup ? (
            <div className="space-y-5">
              <div className="text-center py-4">
                <div className="text-[13px] text-white/40 mb-1">Top Up Saldo</div>
                <div className="text-[32px] font-bold text-white">{formatPrice(topup.amount)}</div>
              </div>

              {topup.status === "PENDING" ? (
                <GradientBorder>
                  <div className="p-5 space-y-4 text-center">
                    <div className="text-[13px] text-white/50">Scan QR code berikut</div>
                    <div className="inline-block bg-white p-3 rounded-[4px]">
                      {topup.gatewayQrString ? (
                        <GatewayQr value={topup.gatewayQrString} />
                      ) : (
                        <div className="w-72 h-72 flex items-center justify-center text-black/40 text-[12px]">QR tidak tersedia</div>
                      )}
                    </div>
                    {topup.gatewayExpiresAt && (
                      <div className="text-[12px] text-white/40">
                        Kadaluarsa dalam <span className="text-tertiary font-semibold"><Countdown expiresAt={topup.gatewayExpiresAt} /></span>
                      </div>
                    )}
                    <div className="text-[11px] text-white/30">Saldo akan otomatis bertambah begitu QRIS ini dibayar.</div>
                  </div>
                </GradientBorder>
              ) : topup.status === "PAID" ? (
                <div className="text-center py-8">
                  <div className="text-[48px] mb-3">✅</div>
                  <p className="text-[14px] text-white/60">Saldo berhasil ditambahkan.</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-[48px] mb-3">⌛</div>
                  <p className="text-[14px] text-white/60">Top up kadaluarsa atau dibatalkan. Buat top up baru untuk mencoba lagi.</p>
                </div>
              )}

              <div className="pt-2 text-center">
                <Link href="/balance">
                  <ButtonPrimary variant="ghost" className="text-[13px]">← Kembali ke Saldo</ButtonPrimary>
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
