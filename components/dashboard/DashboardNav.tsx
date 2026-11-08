"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutGrid, LogOut, MessageCircle, Receipt, Share2, Shield, ShoppingBag, Wallet, type LucideIcon } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import type { SidebarUser } from "@/components/dashboard/DashboardFrame";

type Item = { href: string; label: string; icon: LucideIcon; exact?: boolean };

const accountItems: Item[] = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutGrid, exact: true },
  { href: "/dashboard/balance", label: "Saldo", icon: Wallet },
  { href: "/dashboard/transactions", label: "Transaksi", icon: Receipt },
  { href: "/dashboard/affiliate", label: "Afiliasi", icon: Share2 },
];
const adminItem: Item = { href: "/dashboard/admin", label: "Admin", icon: Shield };

function useNav(isAdmin: boolean) {
  const pathname = usePathname();
  const items = isAdmin ? [...accountItems, adminItem] : accountItems;
  const isActive = (i: Item) => (i.exact ? pathname === i.href : pathname.startsWith(i.href));
  return { items, isActive };
}

const rowClass = "kr-press flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors";
const groupLabel = "px-3 pb-1 text-[11px] font-semibold tracking-[0.8px] text-muted";

/** Desktop (lg+) left sidebar: menu, shop links, and the signed-in user with theme + logout. */
export function DashboardSidebar({ user }: { user: SidebarUser }) {
  const router = useRouter();
  const { items, isActive } = useNav(user.isAdmin);
  const display = user.name || user.email;

  async function logout() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 hidden h-dvh w-[264px] shrink-0 flex-col justify-between overflow-y-auto border-r border-hairline bg-surface px-4 pt-6 pb-5 lg:flex">
      <div className="flex flex-col gap-7">
        {/* Same logo treatment as the Navbar: white backing in dark mode so the dark text stays readable. */}
        <Link href="/" className="w-fit rounded-lg px-2">
          <Image
            src="/logo_website.png"
            alt="KampusRebahan"
            width={184}
            height={46}
            loading="eager"
            className="h-10 w-[155px] object-contain dark:rounded-[4px] dark:bg-white dark:p-1"
          />
        </Link>

        <nav aria-label="Dashboard" className="flex flex-col gap-1">
          <p className={groupLabel}>AKUN</p>
          {items.map((i) => {
            const active = isActive(i);
            const Icon = i.icon;
            return (
              <Link
                key={i.href}
                href={i.href}
                aria-current={active ? "page" : undefined}
                className={`${rowClass} ${active ? "bg-ink font-semibold text-on-ink" : "font-medium text-ink hover:bg-pill"}`}
              >
                <Icon size={18} aria-hidden="true" className={active ? "" : "text-muted"} />
                {i.label}
              </Link>
            );
          })}
        </nav>

        <nav aria-label="Toko" className="flex flex-col gap-1">
          <p className={groupLabel}>TOKO</p>
          <Link href="/products" className={`${rowClass} font-medium text-ink hover:bg-pill`}>
            <ShoppingBag size={18} aria-hidden="true" className="text-muted" /> Belanja produk
          </Link>
          <a
            href="https://wa.me/6285180642043"
            target="_blank"
            rel="noopener noreferrer"
            className={`${rowClass} font-medium text-ink hover:bg-pill`}
          >
            <MessageCircle size={18} aria-hidden="true" className="text-muted" /> Bantuan
          </a>
        </nav>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-card p-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pill text-[15px] font-bold text-ink">
            {display.charAt(0).toUpperCase()}
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-ink">{display}</span>
            {user.name && <span className="truncate text-xs text-muted">{user.email}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={logout}
            className="kr-press flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-hairline bg-surface text-sm font-semibold text-danger hover:bg-danger-bg"
          >
            <LogOut size={16} aria-hidden="true" /> Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}

/** Phone/tablet (< lg) fixed bottom bar, same pattern as the admin bottom bar. */
export function DashboardBottomBar({ isAdmin }: { isAdmin: boolean }) {
  const { items, isActive } = useNav(isAdmin);

  return (
    <nav
      aria-label="Dashboard"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex max-w-[560px] items-stretch justify-between px-1.5 pt-1.5 pb-1">
        {items.map((i) => {
          const active = isActive(i);
          const Icon = i.icon;
          return (
            <li key={i.href} className="flex-1">
              <Link
                href={i.href}
                aria-current={active ? "page" : undefined}
                className="kr-press flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold"
              >
                <span className={`flex h-8 w-14 items-center justify-center rounded-full ${active ? "bg-pill text-ink" : "text-muted"}`}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className={active ? "text-ink" : "text-muted"}>{i.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
