"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BalanceHistoryTable from "@/components/dashboard/BalanceHistoryTable";
import type { BalanceTransaction } from "@/components/dashboard/BalanceHistoryTable";
import CountUp from "@/components/dashboard/CountUp";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import { Zap } from "lucide-react";

const TOPUP_MIN_AMOUNT = 10000;
const TOPUP_MAX_AMOUNT = 500000;
const PRESET_AMOUNTS = [10000, 25000, 50000, 100000];

type TopupMethod = "QRIS_GATEWAY" | "QRIS_BRIDGE";
const METHOD_LABEL: Record<TopupMethod, string> = { QRIS_GATEWAY: "QRIS Bayar.gg", QRIS_BRIDGE: "QRIS Instan" };

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export default function BalancePage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<BalanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number | "">("");
  const [topupLoading, setTopupLoading] = useState(false);
  const [error, setError] = useState("");
  const [methods, setMethods] = useState<TopupMethod[] | null>(null);
  const [method, setMethod] = useState<TopupMethod>("QRIS_GATEWAY");

  useEffect(() => {
    Promise.all([
      fetch("/api/balance").then((r) => r.json()),
      fetch("/api/balance/transactions").then((r) => r.json()),
    ])
      .then(([balanceData, txnData]) => {
        if (balanceData.success) setBalance(balanceData.data.balance);
        if (txnData.success) setTransactions(txnData.data);
      })
      .finally(() => setLoading(false));

    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((d) => {
        const list: TopupMethod[] = [];
        if (d.data?.topupQrisGatewayEnabled) list.push("QRIS_GATEWAY");
        if (d.data?.topupQrisBridgeEnabled) list.push("QRIS_BRIDGE");
        setMethods(list);
        if (list[0]) setMethod(list[0]);
      })
      .catch(() => setMethods(["QRIS_GATEWAY"]));
  }, []);

  async function handleTopup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const numAmount = Number(amount);
    if (!Number.isInteger(numAmount) || numAmount < TOPUP_MIN_AMOUNT || numAmount > TOPUP_MAX_AMOUNT) {
      setError(`Nominal harus antara ${formatPrice(TOPUP_MIN_AMOUNT)} – ${formatPrice(TOPUP_MAX_AMOUNT)}.`);
      return;
    }

    setTopupLoading(true);
    try {
      const res = await fetch("/api/balance/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numAmount, paymentMethod: method }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.data.payment_url) window.location.href = data.data.payment_url;
        else router.push(`/dashboard/balance/topup/${data.data.topupId}`);
      } else {
        const msg = data.message ?? "Gagal membuat top up.";
        setError(msg);
        addToast(msg, "error");
      }
    } catch {
      const msg = "Terjadi kesalahan. Coba lagi.";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setTopupLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 md:gap-7">
      <DashboardHeader title="Saldo" subtitle="Isi saldo dan lihat riwayat mutasi." />

      <Reveal onMount stagger={0.06} className="flex flex-col gap-5 md:gap-6 lg:flex-row">
        <RevealItem className="flex flex-col justify-center gap-2 rounded-[28px] bg-ink p-5 text-on-ink shadow-card md:p-7 lg:w-[420px] lg:shrink-0">
          <span className="text-sm font-medium text-on-ink-muted">Saldo aktif</span>
          {loading ? (
            <Skeleton className="kr-shimmer h-10 w-40 md:h-14 md:w-56" radius="rounded-lg" />
          ) : (
            <span className="font-display text-4xl font-bold leading-none [overflow-wrap:anywhere] md:text-[56px]">
              <CountUp value={balance} format={formatPrice} />
            </span>
          )}
        </RevealItem>

        <RevealItem className="min-w-0 flex-1 rounded-[28px] bg-surface p-5 shadow-card md:p-7">
          <h2 className="mb-4 text-xl font-semibold">Isi saldo</h2>
          <form onSubmit={handleTopup} className="flex flex-col gap-4">
            <div role="group" aria-label="Nominal cepat" className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {PRESET_AMOUNTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={amount === value}
                  onClick={() => setAmount(value)}
                  className="kr-chip kr-press px-2"
                >
                  {formatPrice(value)}
                </button>
              ))}
            </div>
            <div>
              <label htmlFor="topup-amount" className="mb-2 block text-[13px] font-semibold">
                Nominal lain{" "}
                <span className="font-normal text-muted">
                  (Rp{TOPUP_MIN_AMOUNT.toLocaleString("id-ID")} – Rp{TOPUP_MAX_AMOUNT.toLocaleString("id-ID")})
                </span>
              </label>
              <input
                id="topup-amount"
                type="number"
                min={TOPUP_MIN_AMOUNT}
                max={TOPUP_MAX_AMOUNT}
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="50000"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "topup-error" : undefined}
                className="kr-field"
              />
            </div>

            {methods && methods.length > 1 && (
              <div role="group" aria-label="Metode pembayaran" className="grid grid-cols-2 gap-2">
                {methods.map((m) => (
                  <button key={m} type="button" aria-pressed={method === m} onClick={() => setMethod(m)} className="kr-chip kr-press px-2">
                    {METHOD_LABEL[m]}
                  </button>
                ))}
              </div>
            )}

            {methods?.length === 0 && (
              <p role="status" className="rounded-2xl bg-pill px-4 py-3 text-[13px] font-medium text-muted">
                Top up saldo sedang tidak tersedia. Coba lagi nanti.
              </p>
            )}

            {error && (
              <div id="topup-error" role="alert" className="rounded-2xl bg-danger-bg px-4 py-3 text-[13px] font-medium text-danger">
                {error}
              </div>
            )}

            <ButtonPrimary type="submit" disabled={topupLoading || methods?.length === 0} className="kr-press w-full">
              <Zap size={16} aria-hidden="true" />
              {topupLoading ? "Memproses..." : "Isi saldo via QRIS"}
            </ButtonPrimary>
          </form>
        </RevealItem>
      </Reveal>

      <h2 className="text-xl font-semibold md:text-2xl">Riwayat saldo</h2>
      {loading ? (
        <Skeleton className="kr-shimmer h-48 w-full" radius="rounded-[24px]" />
      ) : (
        <BalanceHistoryTable transactions={transactions} />
      )}
    </div>
  );
}
