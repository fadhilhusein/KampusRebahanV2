"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Banknote, Gift, House, Receipt, Settings, type LucideIcon } from "lucide-react";

export interface AdminSummary {
  counts: { retry: number; processing: number; transfer: number; payouts: number; orders: number };
  today: { revenue: number; profit: number; orders: number };
  recent: {
    id: string;
    productName: string;
    variantName: string;
    sellPrice: number;
    status: string;
    refundedAt: string | null;
    createdAt: string;
    user: { email: string };
  }[];
}

const SummaryContext = createContext<{ summary: AdminSummary | null; refresh: () => void }>({ summary: null, refresh: () => {} });

/** Summary shared by the nav badges and pages; call refresh() after an action changes counts. */
export const useAdminSummary = () => useContext(SummaryContext);

type Tab = { href: string; label: string; icon: LucideIcon; badge?: (c: AdminSummary["counts"]) => number; tone?: "danger" };

/** Admin menu, shown by the dashboard sidebar and bottom bar inside /dashboard/admin. */
export const adminTabs: Tab[] = [
  { href: "/dashboard/admin", label: "Beranda", icon: House },
  { href: "/dashboard/admin/orders", label: "Pesanan", icon: Receipt, badge: (c) => c.orders, tone: "danger" },
  { href: "/dashboard/admin/payouts", label: "Pencairan", icon: Banknote, badge: (c) => c.payouts },
  { href: "/dashboard/admin/loyalty", label: "Loyalitas", icon: Gift },
  { href: "/dashboard/admin/settings", label: "Pengaturan", icon: Settings },
];

export function CountBadge({ n, tone, className = "" }: { n: number; tone?: "danger"; className?: string }) {
  if (!n) return null;
  return (
    <span
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold leading-none ${
        tone === "danger" ? "bg-danger text-white" : "bg-ink text-on-ink"
      } ${className}`}
    >
      {n > 99 ? "99+" : n}
    </span>
  );
}

/** Loads the admin summary. Sits in DashboardFrame so the sidebar badges and the pages share it. */
export function AdminSummaryProvider({ children }: { children: React.ReactNode }) {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    fetch("/api/admin/summary")
      .then((r) => r.json())
      .then((d) => d.success && setSummary(d.data))
      .catch(() => {});
  }, [version]);

  return <SummaryContext.Provider value={{ summary, refresh }}>{children}</SummaryContext.Provider>;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-5 md:gap-7">{children}</div>;
}

/** Page title and subtitle; navigation lives in the dashboard sidebar / bottom bar. */
export function AdminHeader({ title, subtitle, actions }: { title: string; subtitle?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="[overflow-wrap:anywhere] text-[32px] font-bold leading-tight tracking-[-1.2px] md:text-5xl md:tracking-[-2px]">{title}</h1>
        {subtitle && <p className="text-sm text-muted md:text-[15px]">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
