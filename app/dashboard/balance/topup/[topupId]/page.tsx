"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import GradientBorder from "@/components/ui/GradientBorder";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import GatewayQr from "@/components/payment/GatewayQr";
import Countdown from "@/components/payment/Countdown";
import { useToast } from "@/components/ui/ToastContext";
import { Zap, CheckCircle2, TimerOff } from "lucide-react";

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
          router.push("/dashboard/balance");
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
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-2 text-[12px] text-foreground/30 mb-8">
        <Link href="/dashboard/balance" className="hover:text-foreground transition-colors">Saldo</Link>
        <span>/</span>
        <span className="text-foreground/60">Top Up</span>
      </div>

      {loading ? (
        <div className="text-foreground/30 text-[14px]">Memuat...</div>
      ) : error ? (
        <div className="glass rounded-2xl px-6 py-4 border border-primary/30 text-primary text-[14px]">{error}</div>
      ) : topup ? (
        <div className="space-y-5">
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-foreground/60 mb-1">
              <Zap size={13} className="text-primary" />
              Top Up Saldo
            </div>
            <div className="text-[32px] font-bold text-foreground">{formatPrice(topup.amount)}</div>
          </div>

          {topup.status === "PENDING" ? (
            <GradientBorder radius="rounded-2xl">
              <div className="p-5 space-y-4 text-center">
                <div className="text-[13px] font-medium text-foreground/60">Scan QR code berikut</div>
                <div className="inline-block bg-white p-3 rounded-xl">
                  {topup.gatewayQrString ? (
                    <GatewayQr value={topup.gatewayQrString} />
                  ) : (
                    <div className="w-72 h-72 flex items-center justify-center text-black/40 text-[12px]">QR tidak tersedia</div>
                  )}
                </div>
                {topup.gatewayExpiresAt && (
                  <div className="text-[12px] text-foreground/40">
                    Kadaluarsa dalam <span className="text-tertiary font-semibold"><Countdown expiresAt={topup.gatewayExpiresAt} /></span>
                  </div>
                )}
                <div className="text-[11px] text-foreground/30">Saldo akan otomatis bertambah begitu QRIS ini dibayar.</div>
              </div>
            </GradientBorder>
          ) : topup.status === "PAID" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={30} />
              </div>
              <p className="text-[14px] font-medium text-foreground/70">Saldo berhasil ditambahkan.</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto mb-3">
                <TimerOff size={30} />
              </div>
              <p className="text-[14px] font-medium text-foreground/70">Top up kadaluarsa atau dibatalkan. Buat top up baru untuk mencoba lagi.</p>
            </div>
          )}

          <div className="pt-2 text-center">
            <Link href="/dashboard/balance">
              <ButtonPrimary variant="ghost" className="text-[13px]">← Kembali ke Saldo</ButtonPrimary>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
