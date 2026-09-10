"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassCard from "@/components/ui/GlassCard";
import GradientBorder from "@/components/ui/GradientBorder";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { useToast } from "@/components/ui/ToastContext";
import { Wallet, Zap, History, ArrowUpCircle, ShoppingBag, Undo2, Settings2 } from "lucide-react";

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

const txnIcon: Record<string, typeof ArrowUpCircle> = {
  TOPUP: ArrowUpCircle,
  PURCHASE: ShoppingBag,
  REFUND: Undo2,
  ADJUSTMENT: Settings2,
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
          <h1 className="text-[32px] font-semibold text-foreground leading-none tracking-tight mb-8">
            Saldo Akun
          </h1>

          <GradientBorder radius="rounded-2xl">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Wallet size={14} className="text-primary" />
                <div className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider">Saldo Saat Ini</div>
              </div>
              <div className="text-[36px] font-bold text-foreground">
                {loading ? "…" : formatPrice(balance)}
              </div>
            </div>
          </GradientBorder>

          <GlassCard radius="rounded-2xl" className="p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} className="text-primary" />
              <div className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider">Top Up Saldo</div>
            </div>
            <form onSubmit={handleTopup} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-foreground/80 mb-2">
                  Nominal <span className="text-foreground/40 font-normal">(Rp{TOPUP_MIN_AMOUNT.toLocaleString("id-ID")} – Rp{TOPUP_MAX_AMOUNT.toLocaleString("id-ID")})</span>
                </label>
                <input
                  type="number"
                  min={TOPUP_MIN_AMOUNT}
                  max={TOPUP_MAX_AMOUNT}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="50000"
                  className="w-full glass rounded-xl px-4 py-3 text-[14px] font-medium text-foreground placeholder-foreground/20 border border-foreground/10 focus:border-primary/40 focus:outline-none transition-colors bg-transparent"
                />
              </div>

              {error && (
                <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 text-[13px] font-medium text-primary">
                  {error}
                </div>
              )}

              <ButtonPrimary type="submit" disabled={topupLoading} className="w-full py-3 text-[14px] flex items-center justify-center gap-2">
                <Zap size={16} />
                {topupLoading ? "Memproses..." : "Top Up via QRIS"}
              </ButtonPrimary>
            </form>
          </GlassCard>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <History size={14} className="text-primary" />
              <div className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider">Riwayat Transaksi</div>
            </div>
            {loading ? (
              <div className="text-foreground/30 text-[14px]">Memuat...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-foreground/30 text-[14px]">Belum ada transaksi.</div>
            ) : (
              <div className="space-y-2.5">
                {transactions.map((txn) => {
                  const Icon = txnIcon[txn.type] ?? Settings2;
                  const isCredit = txn.amount >= 0;
                  return (
                    <GlassCard key={txn.id} radius="rounded-2xl" className="p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isCredit ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary"}`}>
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[14px] font-semibold text-foreground">
                              {txnLabel[txn.type] ?? txn.type}
                            </div>
                            <div className="text-[11px] text-foreground/40 mt-0.5">{formatDate(txn.createdAt)}</div>
                            {txn.note && <div className="text-[11px] text-foreground/50 font-medium mt-0.5 truncate">{txn.note}</div>}
                          </div>
                        </div>
                        <div className={`text-[14px] font-bold flex-shrink-0 ${isCredit ? "text-secondary" : "text-primary"}`}>
                          {isCredit ? "+" : ""}{formatPrice(txn.amount)}
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
