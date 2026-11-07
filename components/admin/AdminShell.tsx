"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Banknote, Gift, House, Receipt, Settings, type LucideIcon } from "lucide-react";

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

const tabs: Tab[] = [
  { href: "/dashboard/admin", label: "Beranda", icon: House },
  { href: "/dashboard/admin/orders", label: "Pesanan", icon: Receipt, badge: (c) => c.orders, tone: "danger" },
  { href: "/dashboard/admin/payouts", label: "Pencairan", icon: Banknote, badge: (c) => c.payouts },
  { href: "/dashboard/admin/loyalty", label: "Loyalitas", icon: Gift },
  { href: "/dashboard/admin/settings", label: "Pengaturan", icon: Settings },
];

const isActive = (pathname: string, href: string) =>
  href === "/dashboard/admin" ? pathname === href : pathname.startsWith(href);

function CountBadge({ n, tone, className = "" }: { n: number; tone?: "danger"; className?: string }) {
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

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    fetch("/api/admin/summary")
      .then((r) => r.json())
      .then((d) => d.success && setSummary(d.data))
      .catch(() => {});
  }, [version]);

  const pathname = usePathname();

  return (
    <SummaryContext.Provider value={{ summary, refresh }}>
      {/* Room so the fixed bottom bar never covers the last card or the footer. */}
      <div className="flex flex-col gap-5 max-md:pb-24 md:gap-7">{children}</div>

      <nav
        aria-label="Menu admin"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="mx-auto flex max-w-[560px] items-stretch justify-between px-1.5 pt-1.5 pb-1">
          {tabs.map((t) => {
            const active = isActive(pathname, t.href);
            const Icon = t.icon;
            const n = summary && t.badge ? t.badge(summary.counts) : 0;
            return (
              <li key={t.href} className="flex-1">
                <Link
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className="kr-press flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold"
                >
                  <span className={`relative flex h-8 w-14 items-center justify-center rounded-full ${active ? "bg-pill text-ink" : "text-muted"}`}>
                    <Icon size={20} aria-hidden="true" />
                    <CountBadge n={n} tone={t.tone} className="absolute -top-1.5 right-1" />
                  </span>
                  <span className={active ? "text-ink" : "text-muted"}>{t.label}</span>
                  {n > 0 && <span className="sr-only">({n} perlu tindakan)</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </SummaryContext.Provider>
  );
}

/** Page header: back link on phones, title, subtitle, and the admin tabs on desktop. */
export function AdminHeader({ title, subtitle, actions }: { title: string; subtitle?: React.ReactNode; actions?: React.ReactNode }) {
  const pathname = usePathname();
  const { summary } = useAdminSummary();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Link href="/dashboard" className="kr-press inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-surface px-4 text-sm font-semibold shadow-card md:hidden">
        <ArrowLeft size={16} aria-hidden="true" /> Dashboard
      </Link>
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="[overflow-wrap:anywhere] text-[32px] font-bold leading-tight tracking-[-1.2px] md:text-[56px] md:tracking-[-2.5px]">{title}</h1>
          {subtitle && <p className="text-sm text-muted md:text-base">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <nav aria-label="Menu admin" className="hidden flex-wrap gap-2 md:flex">
        {tabs.map((t) => {
          const active = isActive(pathname, t.href);
          const Icon = t.icon;
          const n = summary && t.badge ? t.badge(summary.counts) : 0;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`kr-chip kr-press px-[18px] py-2.5 text-[13px] ${active ? "!bg-ink !text-on-ink" : ""}`}
            >
              <Icon size={16} aria-hidden="true" />
              {t.label}
              <CountBadge n={n} tone={active ? undefined : t.tone} className={active ? "!bg-on-ink !text-ink" : ""} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
