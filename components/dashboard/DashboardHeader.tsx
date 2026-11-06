"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Receipt, Shield, Wallet, type LucideIcon } from "lucide-react";
import { useDashboardUser } from "@/components/dashboard/DashboardFrame";

type Tab = { href: string; label: string; icon: LucideIcon; exact?: boolean };

const baseTabs: Tab[] = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutGrid, exact: true },
  { href: "/dashboard/balance", label: "Saldo", icon: Wallet },
  { href: "/dashboard/transactions", label: "Transaksi", icon: Receipt },
];

export default function DashboardHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAdmin } = useDashboardUser();
  const tabs = isAdmin ? [...baseTabs, { href: "/dashboard/admin", label: "Admin", icon: Shield }] : baseTabs;
  const isActive = (t: Tab) => (t.exact ? pathname === t.href : pathname.startsWith(t.href));

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="[overflow-wrap:anywhere] text-[34px] font-bold leading-tight tracking-[-1.5px] md:text-[56px] md:tracking-[-2.5px]">{title}</h1>
          {subtitle && <p className="text-sm text-muted md:text-base">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <nav role="navigation" aria-label="Dashboard" className="flex gap-1.5 md:gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = isActive(t);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`kr-chip kr-press flex-1 px-1 text-xs md:flex-none md:px-[18px] md:py-2.5 md:text-[13px] ${active ? "!bg-ink !text-on-ink" : ""}`}
            >
              <Icon size={16} aria-hidden="true" className="hidden md:block" />
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
