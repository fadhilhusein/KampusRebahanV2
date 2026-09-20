"use client";

import { useEffect, useState } from "react";
import { History, Inbox } from "lucide-react";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { TransactionSkeleton } from "@/components/ui/Skeleton";
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
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="mb-1 flex items-center gap-2.5 text-[28px] font-bold leading-tight tracking-tight text-foreground">
          <History size={26} className="text-primary" />
          Riwayat Transaksi
        </h1>
        <p className="text-[14px] text-foreground/50">
          {loading ? "Memuat..." : `${transactions.length} transaksi`}
        </p>
      </div>

      {loading ? (
        <TransactionSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-6 py-4 text-[14px] font-medium text-primary">
          {error}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-24 text-center">
          <Inbox size={40} className="mx-auto mb-3 text-foreground/20" />
          <p className="text-[16px] font-medium text-foreground/40">Belum ada transaksi.</p>
        </div>
      ) : (
        <TransactionsTable transactions={transactions} />
      )}
    </div>
  );
}
