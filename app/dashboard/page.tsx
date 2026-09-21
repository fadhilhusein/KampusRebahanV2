"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CheckCircle2, Clock, CreditCard, History, Inbox, Receipt, ShoppingCart, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import LoyaltyCard from "@/components/dashboard/LoyaltyCard";
import Badge from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { statusColor, statusLabel } from "@/lib/orderStatus";
import type { Transaction } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: string;
  loading: boolean;
  href?: string;
  hint?: string;
}

function StatCard({ label, value, icon: Icon, tone, loading, href, hint }: StatCardProps) {
  const body = (
    <div className="h-full rounded-2xl border border-foreground/20 bg-surface p-5 transition-colors hover:border-foreground/40">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[12px] font-semibold text-foreground/60">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${tone}`}>
          <Icon size={17} />
        </span>
      </div>
      {loading ? (
        <Skeleton className="h-7 w-24" radius="rounded-lg" />
      ) : (
        <div className="text-[24px] font-bold leading-none text-foreground">{value}</div>
      )}
      {hint && (href && <Link href={href} className="flex items-center justify-center gap-2 mt-6 p-2 w-full rounded-xl cursor-pointer text-[11px] bg-primary font-medium text-white hover:bg-primary/15 hover:text-primary"><Wallet size={13} /> {hint}</Link>)}
    </div>
  );
  return body;
}

// The whole row links to the transaction detail through a stretched link on the product name;
// the CTA sits above it (relative z-10) so the two never nest as anchors.
function RecentTransactionRow({ tx }: { tx: Transaction }) {
  // An unpaid order continues to its payment page instead of starting a duplicate purchase.
  const awaitingPayment = tx.db_status === "PENDING_PAYMENT";
  const CtaIcon = awaitingPayment ? CreditCard : ShoppingCart;
  const cta = awaitingPayment
    ? { href: `/order/${tx.order_id}`, label: "Lanjut Bayar", aria: `Lanjut bayar ${tx.productName}` }
    : { href: `/checkout?variant_id=${encodeURIComponent(tx.variantId)}`, label: "Beli Lagi", aria: `Beli lagi ${tx.productName}` };

  return (
    <div className="relative flex items-center gap-4 rounded-2xl border border-foreground/20 bg-surface p-4 transition-colors hover:border-foreground/40">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Badge color={statusColor[tx.db_status] ?? "default"}>{statusLabel[tx.db_status] ?? tx.db_status}</Badge>
          <span className="text-[11px] text-foreground/40">{tx.created_at ? formatDate(tx.created_at) : "—"}</span>
        </div>
        <Link
          href={`/dashboard/transactions/${tx.order_id}`}
          className="block truncate text-[14px] font-semibold text-foreground after:absolute after:inset-0 after:rounded-2xl"
        >
          {tx.productName}
        </Link>
        <div className="truncate text-[12px] text-foreground/50">
          {tx.variantName} · {tx.duration}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="text-[15px] font-bold text-foreground">{formatPrice(tx.total_amount)}</div>
        <Link
          href={cta.href}
          aria-label={cta.aria}
          className="relative z-10 inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-primary/15 hover:text-primary"
        >
          <CtaIcon size={13} />
          {cta.label}
        </Link>
      </div>
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
  const waiting = transactions.filter((t) => t.db_status === "PENDING_PAYMENT").length;
  const completed = transactions.filter((t) => t.db_status === "COMPLETED").length;
  const recent = transactions.slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="mb-1 text-[28px] font-bold leading-tight tracking-tight text-foreground">
          {name ? `Halo, ${name}` : "Dashboard"}
        </h1>
        <p className="text-[14px] text-foreground/50">Ringkasan akun dan transaksi terakhir kamu.</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Saldo"
          value={balance != null ? formatPrice(balance) : "—"}
          icon={Wallet}
          tone="bg-secondary/15 text-secondary"
          loading={loading}
          href="/dashboard/balance"
          hint="Top up saldo"
        />
        <StatCard
          label="Total Transaksi"
          value={error ? "—" : String(transactions.length)}
          icon={Receipt}
          tone="bg-foreground/10 text-foreground/70"
          loading={loading}
        />
        <StatCard
          label="Menunggu Bayar"
          value={error ? "—" : String(waiting)}
          icon={Clock}
          tone="bg-tertiary/15 text-tertiary"
          loading={loading}
        />
        <StatCard
          label="Selesai"
          value={error ? "—" : String(completed)}
          icon={CheckCircle2}
          tone="bg-green-400/15 text-green-500"
          loading={loading}
        />
        <div className="col-span-full">
          <LoyaltyCard />
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[15px] font-bold text-foreground">
          <History size={16} className="text-primary" />
          Transaksi Terakhir
        </h2>
        <Link
          href="/dashboard/transactions"
          className="text-[12px] font-semibold text-foreground/60 underline underline-offset-2 transition-colors hover:text-foreground"
        >
          Lihat semua
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[72px] w-full" radius="rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4 text-[14px] font-medium text-primary">{error}</div>
      ) : recent.length === 0 ? (
        <div className="rounded-2xl border border-foreground/20 bg-surface py-12 text-center">
          <Inbox size={36} className="mx-auto mb-3 text-foreground/20" />
          <p className="mb-3 text-[14px] font-medium text-foreground/50">Belum ada transaksi.</p>
          <Link
            href="/products"
            className="inline-block rounded-full bg-btn-fill px-5 py-2.5 text-[12px] font-semibold text-btn-text transition-opacity hover:opacity-90"
          >
            Lihat Produk
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((tx) => (
            <RecentTransactionRow key={tx.order_id} tx={tx} />
          ))}
        </div>
      )}
    </div>
  );
}
