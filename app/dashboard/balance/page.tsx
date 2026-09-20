"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BalanceHistoryTable from "@/components/dashboard/BalanceHistoryTable";
import type { BalanceTransaction } from "@/components/dashboard/BalanceHistoryTable";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import { Wallet, Zap, History } from "lucide-react";

const TOPUP_MIN_AMOUNT = 10000;
const TOPUP_MAX_AMOUNT = 500000;

const cardClass = "rounded-2xl border border-foreground/20 bg-surface";

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
        body: JSON.stringify({ amount: numAmount }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/balance/topup/${data.data.topupId}`);
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
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-[28px] font-bold leading-tight tracking-tight text-foreground">Saldo Akun</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`${cardClass} flex flex-col items-center justify-center p-6 text-center`}>
          <div className="mb-2 flex items-center justify-center gap-2">
            <Wallet size={14} className="text-primary" />
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">Saldo Saat Ini</div>
          </div>
          {loading ? (
            <Skeleton className="mt-1 h-10 w-40" radius="rounded-lg" />
          ) : (
            <div className="text-[36px] font-bold text-foreground">{formatPrice(balance)}</div>
          )}
        </div>

        <div className={`${cardClass} p-6`}>
          <div className="mb-4 flex items-center gap-2">
            <Zap size={14} className="text-primary" />
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">Top Up Saldo</div>
          </div>
          <form onSubmit={handleTopup} className="space-y-4">
            <div>
              <label htmlFor="topup-amount" className="mb-2 block text-[13px] font-semibold text-foreground/80">
                Nominal{" "}
                <span className="font-normal text-foreground/40">
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
                className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-[14px] font-medium text-foreground transition-colors placeholder:text-foreground/30 focus:border-primary/40 focus:outline-none"
              />
            </div>

            {error && (
              <div role="alert" className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-[13px] font-medium text-primary">
                {error}
              </div>
            )}

            <ButtonPrimary type="submit" disabled={topupLoading} className="flex w-full items-center justify-center gap-2 py-3 text-[14px]">
              <Zap size={16} />
              {topupLoading ? "Memproses..." : "Top Up via QRIS"}
            </ButtonPrimary>
          </form>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <History size={14} className="text-primary" />
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">Riwayat Saldo</h2>
        </div>
        {loading ? <Skeleton className="h-48 w-full" radius="rounded-2xl" /> : <BalanceHistoryTable transactions={transactions} />}
      </div>
    </div>
  );
}
