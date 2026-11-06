"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Inbox } from "lucide-react";
import CountUp from "@/components/dashboard/CountUp";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import LoyaltyCard from "@/components/dashboard/LoyaltyCard";
import Badge from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/Skeleton";
import { statusColor, statusLabel } from "@/lib/orderStatus";
import type { Transaction } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const formatCount = (n: number) => String(n);

function StatCard({
  label,
  value,
  format,
  loading,
  dark,
}: {
  label: string;
  value: number | null;
  format: (n: number) => string;
  loading: boolean;
  dark?: boolean;
}) {
  return (
    <div
      className={`kr-lift flex h-full flex-col gap-1.5 rounded-[28px] p-6 shadow-card hover:shadow-card-hover ${
        dark ? "bg-ink text-on-ink" : "bg-surface text-ink"
      }`}
    >
      <span className={`text-sm font-medium ${dark ? "text-on-ink-muted" : "text-muted"}`}>{label}</span>
      {loading ? (
        <Skeleton className="kr-shimmer h-8 w-28" radius="rounded-lg" />
      ) : (
        // lg (3 kolom di 1024px) terlalu sempit untuk "Rp 1.234.567" ukuran 36
        <span className="font-display text-[32px] font-bold leading-none [overflow-wrap:anywhere] lg:text-[28px] xl:text-4xl">
          {value == null ? "—" : <CountUp value={value} format={format} />}
        </span>
      )}
    </div>
  );
}

export default function DashboardHomePage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      fetch("/api/transactions").then((r) => r.json()),
      fetch("/api/balance").then((r) => r.json()),
    ]).then(([txResult, balanceResult]) => {
      if (cancelled) return;

      if (txResult.status === "fulfilled" && txResult.value.success) {
        setTransactions(txResult.value.data ?? []);
      } else {
        setError(txResult.status === "fulfilled" ? (txResult.value.message ?? "Gagal memuat transaksi.") : "Terjadi kesalahan.");
      }

      if (balanceResult.status === "fulfilled" && balanceResult.value.success) {
        setBalance(balanceResult.value.data.balance);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const name = session?.user?.name ?? session?.user?.email ?? "";
  const recent = transactions.slice(0, 5);
  // Derived client-side from the fetched list: only COMPLETED orders count as purchases.
  const now = new Date();
  const completed = transactions.filter((t) => t.db_status === "COMPLETED");
  const completedThisMonth = completed.filter((t) => {
    const d = t.created_at ? new Date(t.created_at) : null;
    return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalSpent = completed.reduce((sum, t) => sum + t.total_amount, 0);
  const orNull = (v: number) => (error ? null : v);

  return (
    <div className="flex flex-col gap-5 md:gap-7">
      <DashboardHeader
        title={name ? `Halo, ${name}` : "Dashboard"}
        subtitle="Ringkasan akun dan transaksi terakhir kamu."
      />

      {/* md: Saldo selebar baris, dua statistik lain berdampingan; lg: tiga sejajar (SPEC) */}
      <Reveal onMount stagger={0.06} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        <RevealItem className="md:col-span-2 lg:col-span-1">
          <StatCard dark label="Saldo" value={balance} format={formatPrice} loading={loading} />
        </RevealItem>
        <RevealItem>
          <StatCard label="Pesanan bulan ini" value={orNull(completedThisMonth.length)} format={formatCount} loading={loading} />
        </RevealItem>
        <RevealItem>
          <StatCard label="Total belanja" value={orNull(totalSpent)} format={formatPrice} loading={loading} />
        </RevealItem>
      </Reveal>

      <Reveal onMount delay={0.18}>
        <LoyaltyCard />
      </Reveal>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold md:text-2xl">Pesanan terakhir</h2>
        <Link
          href="/dashboard/transactions"
          className="text-[13px] font-semibold text-ink underline underline-offset-2 transition-colors hover:text-muted"
        >
          Lihat semua
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Memuat pesanan">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="kr-shimmer h-[72px] w-full" radius="rounded-[22px]" />
          ))}
        </div>
      ) : error ? (
        <div role="alert" className="rounded-[22px] bg-danger-bg px-5 py-4 text-sm font-medium text-danger">
          {error}
        </div>
      ) : recent.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[28px] bg-surface py-12 text-center shadow-card">
          <Inbox size={36} aria-hidden="true" className="text-line" />
          <p className="text-sm font-medium text-muted">Belum ada transaksi.</p>
          <Link href="/products" className={`kr-press ${buttonClass("primary", "sm")}`}>
            Lihat produk
          </Link>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["Produk", "Tanggal", "Status", "Total"].map((label) => (
                    <TableHead key={label}>{label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((tx, i) => (
                  <TableRow key={tx.order_id} className="kr-fade-up relative" style={{ animationDelay: `${i * 40}ms` }}>
                    <TableCell>
                      <Link href={`/dashboard/transactions/${tx.order_id}`} className="after:absolute after:inset-0">
                        {tx.productName}
                      </Link>
                      <div className="text-xs font-normal text-muted">
                        {tx.variantName} · {tx.duration}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{tx.created_at ? formatDate(tx.created_at) : "—"}</TableCell>
                    <TableCell>
                      <Badge color={statusColor[tx.db_status] ?? "default"}>{statusLabel[tx.db_status] ?? tx.db_status}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-semibold text-ink">{formatPrice(tx.total_amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ul className="flex flex-col gap-3 md:hidden">
            {recent.map((tx, i) => (
              <li
                key={tx.order_id}
                style={{ animationDelay: `${i * 40}ms` }}
                className="kr-fade-up kr-press relative flex items-center justify-between gap-3 rounded-[22px] bg-surface p-4 shadow-card"
              >
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/transactions/${tx.order_id}`}
                    className="block truncate text-sm font-semibold text-ink after:absolute after:inset-0 after:rounded-[22px]"
                  >
                    {tx.productName}
                  </Link>
                  <div className="mt-0.5 truncate text-xs text-muted">
                    {tx.created_at ? formatDate(tx.created_at) : "—"} · {formatPrice(tx.total_amount)}
                  </div>
                </div>
                <span className="shrink-0 whitespace-nowrap"><Badge color={statusColor[tx.db_status] ?? "default"}>{statusLabel[tx.db_status] ?? tx.db_status}</Badge></span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
