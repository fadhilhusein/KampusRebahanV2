"use client";

import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Transaction } from "@/lib/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/transactions")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTransactions(data.data ?? []);
        else setError(data.message ?? "Gagal memuat transaksi.");
      })
      .catch(() => setError("Terjadi kesalahan."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-5 md:gap-7">
      <DashboardHeader title="Transaksi" subtitle={loading ? "Memuat..." : `${transactions.length} transaksi`} />

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Memuat transaksi">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="kr-shimmer h-20 w-full" radius="rounded-[20px]" />
          ))}
        </div>
      ) : error ? (
        <div role="alert" className="kr-fade-in rounded-[22px] bg-danger-bg px-6 py-4 text-sm font-medium text-danger">
          {error}
        </div>
      ) : transactions.length === 0 ? (
        <div className="kr-fade-up flex flex-col items-center gap-3 rounded-[28px] bg-surface py-16 text-center shadow-card">
          <Inbox size={40} aria-hidden="true" className="text-line" />
          <p className="text-base font-medium text-muted">Belum ada transaksi.</p>
        </div>
      ) : (
        <TransactionsTable transactions={transactions} />
      )}
    </div>
  );
}
