"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import GatewayQr from "@/components/payment/GatewayQr";
import Countdown from "@/components/payment/Countdown";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import { CheckCircle2, TimerOff, ArrowLeft } from "lucide-react";

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

const QR_SIZE = "h-[220px] w-[220px] md:h-[260px] md:w-[260px]";

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
    <div className="flex flex-col gap-5 md:gap-7">
      <DashboardHeader title="Isi saldo" subtitle={`Top up #${String(topupId).slice(-8).toUpperCase()}`} />

      {loading ? (
        <div role="status" aria-label="Memuat top up" className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <Skeleton className="kr-shimmer h-[420px] flex-1 md:h-[500px]" radius="rounded-[32px]" />
          <Skeleton className="kr-shimmer h-56 lg:w-[400px] lg:shrink-0" radius="rounded-[28px]" />
        </div>
      ) : error ? (
        <div role="alert" className="kr-fade-in rounded-[22px] bg-danger-bg px-6 py-4 text-sm font-medium text-danger">
          {error}
        </div>
      ) : topup ? (
        <Reveal onMount stagger={0.06} className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <RevealItem className="flex min-w-0 flex-1 flex-col items-center gap-4 rounded-[32px] bg-surface p-6 text-center shadow-card md:p-8">
            {topup.status === "PENDING" ? (
              <>
                <h2 className="text-2xl font-semibold md:text-[32px]">Scan untuk isi saldo</h2>
                <p role="status" className="inline-flex items-center gap-2 text-[13px] font-medium text-muted">
                  <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-60" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-success" />
                  </span>
                  Menunggu pembayaran, dicek otomatis
                </p>
                {topup.gatewayQrString ? (
                  <GatewayQr value={topup.gatewayQrString} className={QR_SIZE} />
                ) : (
                  <div className={`flex items-center justify-center rounded-[20px] bg-pill text-xs text-muted ${QR_SIZE}`}>
                    QR tidak tersedia
                  </div>
                )}
                <div className="font-display text-3xl font-bold">{formatPrice(topup.amount)}</div>
                {topup.gatewayExpiresAt && <Countdown expiresAt={topup.gatewayExpiresAt} />}
              </>
            ) : topup.status === "PAID" ? (
              <div className="kr-fade-in py-8">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-success">
                  <CheckCircle2 size={30} aria-hidden="true" />
                </div>
                <p className="text-sm font-medium">Saldo berhasil ditambahkan.</p>
              </div>
            ) : (
              <div className="kr-fade-in py-8">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-danger-bg text-danger">
                  <TimerOff size={30} aria-hidden="true" />
                </div>
                <p className="text-sm font-medium">Top up kedaluwarsa atau dibatalkan. Buat top up baru untuk mencoba lagi.</p>
              </div>
            )}
          </RevealItem>

          <RevealItem className="flex flex-col gap-4 rounded-[28px] bg-surface p-5 shadow-card md:p-7 lg:w-[400px] lg:shrink-0 lg:self-start">
            <h2 className="text-xl font-semibold">Detail top up</h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Nominal</span>
              <span className="font-semibold">{formatPrice(topup.amount)}</span>
            </div>
            {topup.status === "PENDING" && (
              <p className="text-[13px] text-muted">
                Saldo bertambah otomatis setelah pembayaran terdeteksi. Jangan tutup halaman ini.
              </p>
            )}
            <Link href="/dashboard/balance" className={`kr-press ${buttonClass("secondary")} w-full`}>
              <ArrowLeft size={15} aria-hidden="true" /> Kembali ke Saldo
            </Link>
          </RevealItem>
        </Reveal>
      ) : null}
    </div>
  );
}
