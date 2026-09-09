"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassCard from "@/components/ui/GlassCard";
import GradientBorder from "@/components/ui/GradientBorder";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { useToast } from "@/components/ui/ToastContext";

const TOPUP_MIN_AMOUNT = 10000;
const TOPUP_MAX_AMOUNT = 500000;

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const txnLabel: Record<string, string> = {
  TOPUP: "Top Up",
  PURCHASE: "Pembelian",
  REFUND: "Refund",
  ADJUSTMENT: "Penyesuaian",
};

const txnIcon: Record<string, string> = {
  TOPUP: "⬆️",
  PURCHASE: "🛒",
  REFUND: "↩️",
  ADJUSTMENT: "⚙️",
};

interface BalanceTransaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  note: string | null;
  createdAt: string;
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
        router.push(`/balance/topup/${data.data.topupId}`);
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
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-[32px] font-semibold text-white leading-none tracking-tight mb-8">
            Saldo Akun
          </h1>

          <GradientBorder>
            <div className="p-6 text-center">
              <div className="text-[11px] text-white/30 uppercase tracking-wider mb-2">Saldo Saat Ini</div>
              <div className="text-[36px] font-bold text-white">
                {loading ? "…" : formatPrice(balance)}
              </div>
            </div>
          </GradientBorder>

          <GlassCard className="p-6 mt-6">
            <div className="text-[11px] text-white/30 uppercase tracking-wider mb-4">Top Up Saldo</div>
            <form onSubmit={handleTopup} className="space-y-4">
              <div>
                <label className="block text-[12px] text-white/50 mb-2">
                  Nominal <span className="text-white/20">(Rp{TOPUP_MIN_AMOUNT.toLocaleString("id-ID")} – Rp{TOPUP_MAX_AMOUNT.toLocaleString("id-ID")})</span>
                </label>
                <input
                  type="number"
                  min={TOPUP_MIN_AMOUNT}
                  max={TOPUP_MAX_AMOUNT}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="50000"
                  className="w-full glass rounded-[2px] px-4 py-3 text-[14px] text-white placeholder-white/20 border border-white/10 focus:border-white/30 focus:outline-none transition-colors bg-transparent"
                />
              </div>

              {error && (
                <div className="bg-primary/10 border border-primary/30 rounded-[2px] px-4 py-3 text-[13px] text-primary">
                  {error}
                </div>
              )}

              <ButtonPrimary type="submit" disabled={topupLoading} className="w-full py-3 text-[14px]">
                {topupLoading ? "Memproses..." : "Top Up via QRIS"}
              </ButtonPrimary>
            </form>
          </GlassCard>

          <div className="mt-8">
            <div className="text-[11px] text-white/30 uppercase tracking-wider mb-4">Riwayat Transaksi</div>
            {loading ? (
              <div className="text-white/30 text-[14px]">Memuat...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-[14px]">Belum ada transaksi.</div>
            ) : (
              <div className="space-y-2">
                {transactions.map((txn) => (
                  <GlassCard key={txn.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[13px] text-white font-medium">
                          {txnIcon[txn.type] ?? "•"} {txnLabel[txn.type] ?? txn.type}
                        </div>
                        <div className="text-[11px] text-white/30 mt-0.5">{formatDate(txn.createdAt)}</div>
                        {txn.note && <div className="text-[11px] text-white/40 mt-0.5">{txn.note}</div>}
                      </div>
                      <div className={`text-[14px] font-semibold ${txn.amount >= 0 ? "text-secondary" : "text-primary"}`}>
                        {txn.amount >= 0 ? "+" : ""}{formatPrice(txn.amount)}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
