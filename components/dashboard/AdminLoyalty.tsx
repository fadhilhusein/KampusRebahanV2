"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

interface Row {
  userId: string;
  name: string | null;
  email: string;
  total: number;
  inProgress: number;
  refundedTotal: number;
  refundCount: number;
  lastRefundAt: string | null;
  state: string;
  unlockAt: string | null;
  couponCode: string | null;
  redeemedAt: string | null;
  revokedAt: string | null;
  clawbackAmount: number | null;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

const formatDate = (d: string, time = false) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", ...(time ? { hour: "2-digit", minute: "2-digit" } : {}) });

const stateInfo: Record<string, { label: string; color: "primary" | "secondary" | "tertiary" | "default" }> = {
  BELOW: { label: "Belum memenuhi", color: "default" },
  WAITING: { label: "Masa tunggu 48 jam", color: "tertiary" },
  READY: { label: "Siap terbit", color: "tertiary" },
  REACTIVATING: { label: "Siap aktif lagi", color: "tertiary" },
  ACTIVE: { label: "Kupon aktif", color: "secondary" },
  REDEEMED: { label: "Sudah ditukar", color: "secondary" },
  REVOKED: { label: "Dicabut (refund)", color: "primary" },
};

const filters = [
  ["ALL", "Semua"],
  ["REFUND", "Ada refund"],
  ["WAITING", "Masa tunggu"],
  ["ACTIVE", "Kupon aktif"],
  ["REDEEMED", "Ditukar"],
  ["REVOKED", "Dicabut"],
] as const;

/** Admin view of loyalty progress per customer, including how refunds affected it. */
export default function AdminLoyalty() {
  const [rows, setRows] = useState<Row[]>([]);
  const [threshold, setThreshold] = useState(200000);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof filters)[number][0]>("ALL");

  useEffect(() => {
    fetch("/api/admin/loyalty")
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) return;
        setRows(d.data.rows);
        setThreshold(d.data.threshold);
      })
      .finally(() => setLoading(false));
  }, []);

  const shown = rows.filter((r) =>
    filter === "ALL" ? true : filter === "REFUND" ? r.refundCount > 0 : filter === "WAITING" ? ["WAITING", "READY", "REACTIVATING"].includes(r.state) : r.state === filter
  );

  return (
    <section className="flex flex-col gap-4" aria-labelledby="admin-loyalty">
      <div className="flex flex-col gap-1">
        <h2 id="admin-loyalty" className="text-xl font-semibold md:text-2xl">Kupon loyalitas</h2>
        <p className="text-[13px] text-muted">
          Progres dihitung dari pesanan yang sudah diterima. Refund langsung mengurangi progres; kupon yang belum ditukar dicabut, yang sudah ditukar dipotong dari refund.
        </p>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} aria-pressed={filter === id} className="kr-chip kr-press shrink-0">
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <Skeleton className="h-28 w-full" radius="rounded-[22px]" />
      ) : shown.length === 0 ? (
        <div className="py-10 text-center text-sm font-medium text-muted">Tidak ada data.</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((r) => {
            const pct = Math.min(100, Math.floor((r.total / threshold) * 100));
            const info = stateInfo[r.state] ?? stateInfo.BELOW;
            return (
              <li key={r.userId} className="flex flex-col gap-3 rounded-[22px] bg-surface p-4 shadow-card md:flex-row md:items-center md:gap-6 md:px-6">
                <div className="min-w-0 md:w-[220px]">
                  <div className="truncate text-sm font-semibold">{r.name ?? r.email}</div>
                  <div className="truncate text-xs text-muted">{r.email}</div>
                </div>

                <div className="min-w-0 md:flex-1">
                  <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-semibold">
                    <span>
                      {formatPrice(r.total)} <span className="text-muted">/ {formatPrice(threshold)}</span>
                    </span>
                    <span className="text-muted">{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-pill" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={`Progres ${r.email}`}>
                    <div className="h-full rounded-full bg-ink" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 text-xs text-muted">
                    {r.inProgress > 0 && <span>Diproses {formatPrice(r.inProgress)} (belum dihitung)</span>}
                    {r.refundCount > 0 && (
                      <span className="font-medium text-danger">
                        {r.refundCount} refund · {formatPrice(r.refundedTotal)}
                        {r.lastRefundAt ? ` · terakhir ${formatDate(r.lastRefundAt)}` : ""}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1 md:w-[230px] md:items-end">
                  <Badge color={info.color}>{info.label}</Badge>
                  <span className="text-xs text-muted md:text-right">
                    {r.state === "WAITING" && r.unlockAt && `Terbuka ${formatDate(r.unlockAt, true)}`}
                    {r.state === "REDEEMED" && r.redeemedAt && `Ditukar ${formatDate(r.redeemedAt)}`}
                    {r.state === "ACTIVE" && r.couponCode}
                    {r.revokedAt && ` · dicabut ${formatDate(r.revokedAt)}`}
                    {r.clawbackAmount ? ` · refund dipotong ${formatPrice(r.clawbackAmount)}` : ""}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
