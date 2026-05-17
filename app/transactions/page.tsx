"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientBorder from "@/components/ui/GradientBorder";
import Badge from "@/components/ui/Badge";
import { TransactionSkeleton } from "@/components/ui/Skeleton";
import type { Transaction } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusColor: Record<string, "primary" | "secondary" | "tertiary" | "default"> = {
  PENDING_PAYMENT: "tertiary",
  PAID: "secondary",
  PROCESSING: "tertiary",
  COMPLETED: "secondary",
  FAILED: "primary",
  REJECTED: "primary",
};

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Bayar",
  PAID: "Menunggu Verifikasi",
  PROCESSING: "Diproses",
  COMPLETED: "Selesai",
  FAILED: "Gagal",
  REJECTED: "Ditolak",
};

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
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-[40px] font-semibold text-white leading-none tracking-tight mb-2">
              Riwayat Transaksi
            </h1>
            <p className="text-[14px] text-white/40">
              {loading ? "Memuat..." : `${transactions.length} transaksi`}
            </p>
          </div>

          {loading ? (
            <TransactionSkeleton />
          ) : error ? (
            <div className="glass rounded-[2px] px-6 py-4 border border-primary/30 text-primary text-[14px]">
              {error}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/30 text-[16px]">Belum ada transaksi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <Link key={tx.order_id} href={`/transactions/${tx.order_id}`}>
                  <GradientBorder>
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 glass-hover transition-all duration-200 rounded-[2px]">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <Badge color={statusColor[tx.db_status] ?? "default"}>
                            {statusLabel[tx.db_status] ?? tx.db_status}
                          </Badge>
                          {tx.account_details?.length > 0 && (
                            <Badge color="default">{tx.account_details.length} akun</Badge>
                          )}
                        </div>
                        <div className="text-[14px] font-medium text-white truncate">
                          {tx.productName}
                        </div>
                        <div className="text-[12px] text-white/40 mt-0.5">
                          {tx.variantName} · {tx.duration} · {tx.type}
                        </div>
                        <div className="text-[11px] text-white/25 mt-1">
                          {tx.created_at ? formatDate(tx.created_at) : "—"}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[18px] font-semibold text-white">
                          {formatPrice(tx.total_amount)}
                        </div>
                        <div className="text-[11px] text-white/30 mt-0.5">
                          {tx.quantity}x · {tx.paymentMethod === "QRIS" ? "QRIS" : "Transfer"}
                        </div>
                        <div className="text-[11px] text-white/20 mt-1">
                          Lihat detail →
                        </div>
                      </div>
                    </div>
                  </GradientBorder>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
