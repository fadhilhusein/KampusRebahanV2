"use client";

import Link from "next/link";
import { Banknote, ChevronRight, Hourglass, Landmark, TriangleAlert, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { AdminHeader, useAdminSummary } from "@/components/admin/AdminShell";
import { StatusBadge, formatPrice, timeAgo } from "@/components/admin/shared";
import { displayStatus } from "@/lib/orderStatus";

const today = () => new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

function ActionRow({ href, icon: Icon, tone, label, count }: { href: string; icon: LucideIcon; tone: string; label: string; count: number }) {
  return (
    <li className="border-t border-hairline first:border-t-0">
      <Link href={href} className="kr-press flex min-h-16 items-center gap-3.5 py-3">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] ${tone}`}>
          <Icon size={20} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug">{label}</span>
        <span className="font-display text-xl font-bold tabular-nums">{count}</span>
        <ChevronRight size={18} aria-hidden="true" className="text-muted" />
      </Link>
    </li>
  );
}

function Tile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-[22px] bg-surface p-4 shadow-card md:p-6">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="truncate font-display text-[22px] font-bold tabular-nums tracking-[-0.5px] md:text-[30px]">{value}</span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}

export default function AdminHomePage() {
  const { summary } = useAdminSummary();
  const c = summary?.counts;
  const total = c ? c.retry + c.processing + c.transfer + c.payouts : 0;

  const rows = c
    ? [
        { href: "/dashboard/admin/orders?filter=retry", icon: TriangleAlert, tone: "bg-danger-bg text-danger", label: "Gagal ke supplier, perlu retry", count: c.retry },
        { href: "/dashboard/admin/orders?filter=processing", icon: Hourglass, tone: "bg-warn-bg text-warn", label: "Menunggu supplier (termasuk PO)", count: c.processing },
        { href: "/dashboard/admin/payouts", icon: Banknote, tone: "bg-pill text-accent", label: "Pencairan menunggu", count: c.payouts },
        { href: "/dashboard/admin/orders?filter=action", icon: Landmark, tone: "bg-pill text-ink", label: "Transfer menunggu konfirmasi", count: c.transfer },
      ].filter((r) => r.count > 0)
    : [];

  return (
    <>
      <AdminHeader title="Admin" subtitle={`Hari ini, ${today()}`} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-6">
        <section aria-labelledby="todo" className="rounded-[28px] bg-surface p-5 shadow-card md:p-6">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 id="todo" className="text-xl font-semibold">Perlu tindakan</h2>
            {total > 0 && <span className="rounded-full bg-danger-bg px-3 py-1 text-[13px] font-semibold text-danger">{total} item</span>}
          </div>
          {!summary ? (
            <Skeleton className="mt-3 h-40 w-full" radius="rounded-[18px]" />
          ) : rows.length === 0 ? (
            <p className="py-6 text-sm text-muted">Semua beres. Tidak ada yang perlu ditindaklanjuti.</p>
          ) : (
            <ul>{rows.map((r) => <ActionRow key={r.label} {...r} />)}</ul>
          )}
        </section>

        <div className="flex flex-col gap-5 lg:gap-6">
          <section aria-labelledby="today-title" className="flex flex-col gap-3">
            <h2 id="today-title" className="text-xl font-semibold">Ringkasan hari ini</h2>
            {!summary ? (
              <Skeleton className="h-40 w-full" radius="rounded-[22px]" />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Tile label="Pendapatan" value={formatPrice(summary.today.revenue)} />
                <Tile
                  label="Profit"
                  value={formatPrice(summary.today.profit)}
                  hint={summary.today.revenue ? `Margin ${Math.round((summary.today.profit / summary.today.revenue) * 100)}%` : undefined}
                />
                <Tile label="Pesanan dibayar" value={String(summary.today.orders)} />
                <Tile label="Menunggu supplier" value={String(summary.counts.processing)} hint="semua hari" />
              </div>
            )}
          </section>

          <section aria-labelledby="recent" className="rounded-[28px] bg-surface p-5 shadow-card md:p-6">
            <div className="mb-1 flex items-center justify-between gap-3">
              <h2 id="recent" className="text-xl font-semibold">Aktivitas terbaru</h2>
              <Link href="/dashboard/admin/orders?filter=all" className="kr-press inline-flex min-h-11 items-center text-sm font-semibold text-accent">Lihat semua</Link>
            </div>
            {!summary ? (
              <Skeleton className="h-48 w-full" radius="rounded-[18px]" />
            ) : summary.recent.length === 0 ? (
              <p className="py-6 text-sm text-muted">Belum ada pesanan.</p>
            ) : (
              <ul>
                {summary.recent.map((o) => (
                  <li key={o.id} className="flex items-start justify-between gap-3 border-t border-hairline py-3 first:border-t-0">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{o.productName} · {o.variantName}</span>
                      <span className="block truncate text-xs text-muted">{o.user.email} · {timeAgo(o.createdAt)}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm font-semibold tabular-nums">{formatPrice(o.sellPrice)}</span>
                      <StatusBadge statusKey={displayStatus(o.status, o.refundedAt)} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
