"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, CornerDownLeft, Menu, PanelLeftClose, PanelLeftOpen, Search, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export type NavItemData = {
  id: string;
  title: string;
  icon: React.ElementType;
  /** Route to navigate to. Items without href/children run onClick instead. */
  href?: string;
  onClick?: () => void;
  badge?: number | string;
  tone?: "danger";
  children?: NavItemData[];
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

export type SidebarUser = {
  name: string | null;
  email: string;
  isAdmin: boolean;
};

function matchesPath(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isItemActive(item: NavItemData, pathname: string): boolean {
  if (item.href && matchesPath(item.href, pathname)) return true;
  return item.children?.some((child) => isItemActive(child, pathname)) ?? false;
}

function flattenItems(items: NavItemData[]): NavItemData[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenItems(item.children) : [])]);
}

function NavItem({
  item,
  pathname,
  onNavigate,
  level = 0,
}: {
  item: NavItemData;
  pathname: string;
  onNavigate?: () => void;
  level?: number;
}) {
  const active = isItemActive(item, pathname);
  const hasChildren = !!item.children?.length;
  const [isOpen, setIsOpen] = useState(active);

  const rowClass = `group flex w-full items-center justify-between gap-2 rounded-xl py-2 pr-2.5 text-left text-[13px] transition-colors select-none cursor-pointer ${
    active && !hasChildren
      ? "bg-foreground/10 font-semibold text-foreground"
      : item.tone === "danger"
        ? "font-medium text-foreground/60 hover:bg-primary/10 hover:text-primary"
        : "font-medium text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
  }`;
  const rowStyle = { paddingLeft: `${level * 12 + 10}px` };

  const content = (
    <>
      <span className="flex min-w-0 items-center gap-2.5">
        <item.icon
          size={16}
          strokeWidth={1.75}
          className={`shrink-0 transition-colors ${
            active ? "text-primary" : item.tone === "danger" ? "" : "text-foreground/40 group-hover:text-foreground/70"
          }`}
        />
        <span className="truncate">{item.title}</span>
      </span>
      <span className="flex items-center gap-2">
        {item.badge != null && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/15 px-1.5 text-[10px] font-semibold text-primary">
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <ChevronRight
            size={14}
            strokeWidth={2}
            className={`text-foreground/40 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          />
        )}
      </span>
    </>
  );

  return (
    <div className="flex w-full flex-col">
      {hasChildren ? (
        <button type="button" className={rowClass} style={rowStyle} onClick={() => setIsOpen((v) => !v)} aria-expanded={isOpen}>
          {content}
        </button>
      ) : item.href ? (
        <Link
          href={item.href}
          className={rowClass}
          style={rowStyle}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          className={rowClass}
          style={rowStyle}
          onClick={() => {
            item.onClick?.();
            onNavigate?.();
          }}
        >
          {content}
        </button>
      )}

      {hasChildren && (
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="relative mt-0.5 flex min-h-0 flex-col gap-0.5 overflow-hidden">
            <div className="absolute bottom-0 top-0 border-l border-foreground/10" style={{ left: `${level * 12 + 17.5}px` }} />
            {item.children!.map((child) => (
              <NavItem key={child.id} item={child} pathname={pathname} onNavigate={onNavigate} level={level + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UserCard({ user }: { user: SidebarUser }) {
  const label = user.name?.trim() || user.email;
  return (
    <div className="mb-2 flex items-center gap-3 rounded-xl border border-foreground/10 p-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[14px] font-bold uppercase text-primary">
        {label.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold leading-tight text-foreground">{label}</div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span
            className={`shrink-0 rounded-full px-1.5 py-px text-[10px] font-semibold ${
              user.isAdmin ? "bg-tertiary/15 text-tertiary" : "bg-foreground/10 text-foreground/50"
            }`}
          >
            {user.isAdmin ? "Admin" : "Member"}
          </span>
          {user.name && <span className="truncate text-[11px] text-foreground/40">{user.email}</span>}
        </div>
      </div>
    </div>
  );
}

export function SidebarNav({
  className = "",
  groups,
  bottomItems,
  user,
  onNavigate,
  onSearch,
}: {
  className?: string;
  groups: NavGroupData[];
  bottomItems: NavItemData[];
  user: SidebarUser;
  onNavigate?: () => void;
  onSearch: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className={`flex h-full w-[260px] flex-col bg-surface p-3 ${className}`}>
      <Link href="/" onClick={onNavigate} className="mb-3 flex items-center px-1.5" aria-label="Ke beranda KampusRebahan">
        <img src="/logo_website.png" alt="Kampus Rebahan" className="h-10 w-auto" />
      </Link>

      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          onSearch();
        }}
        className="group mb-3 flex w-full cursor-pointer items-center justify-between rounded-xl border border-foreground/10 px-3 py-2 text-[13px] font-medium text-foreground/50 transition-colors hover:border-foreground/20 hover:text-foreground"
      >
        <span className="flex items-center gap-2.5">
          <Search size={16} strokeWidth={1.75} className="text-foreground/40 group-hover:text-foreground/70" />
          Cari menu
        </span>
        <kbd className="rounded-md border border-foreground/10 px-1.5 py-0.5 font-mono text-[10px] text-foreground/40">Ctrl K</kbd>
      </button>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {groups.map((group, idx) => (
          <div key={group.heading ?? idx} className="flex flex-col gap-0.5">
            {group.heading && (
              <span className="mb-1 px-2.5 text-[11px] font-bold uppercase tracking-wider text-foreground/40">{group.heading}</span>
            )}
            {group.items.map((item) => (
              <NavItem key={item.id} item={item} pathname={pathname} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-0.5 border-t border-foreground/10 pt-3">
        <UserCard user={user} />
        {bottomItems.map((item) => (
          <NavItem key={item.id} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function CommandSearch({ items, onClose }: { items: NavItemData[]; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((item) => item.title.toLowerCase().includes(q)) : items;
  }, [items, query]);

  function go(item: NavItemData) {
    onClose();
    if (item.href) router.push(item.href);
    else item.onClick?.();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      go(results[cursor]);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-background/60 px-4 pt-[15vh] backdrop-blur-sm" role="dialog" aria-label="Cari menu">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-foreground/20 bg-surface">
        <div className="flex items-center border-b border-foreground/10 px-4">
          <Search size={18} strokeWidth={1.75} className="mr-3 shrink-0 text-foreground/40" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Cari menu dashboard..."
            className="flex-1 bg-transparent py-4 text-[14px] text-foreground outline-none placeholder:text-foreground/30"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pencarian"
            className="ml-2 cursor-pointer rounded-lg p-1 text-foreground/40 transition-colors hover:bg-foreground/10 hover:text-foreground"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="py-8 text-center text-[13px] font-medium text-foreground/40">Menu tidak ditemukan.</p>
          ) : (
            results.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item)}
                onMouseEnter={() => setCursor(idx)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
                  idx === cursor ? "bg-foreground/10 text-foreground" : "text-foreground/60"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <item.icon size={16} strokeWidth={1.75} className={idx === cursor ? "text-primary" : "text-foreground/40"} />
                  {item.title}
                </span>
                {idx === cursor && <CornerDownLeft size={14} className="text-foreground/40" />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Dashboard chrome: collapsible sidebar (drawer on mobile), top bar with breadcrumb + theme toggle,
// and a scrollable content area for the page.
export default function DashboardShell({
  groups,
  bottomItems,
  user,
  children,
}: {
  groups: NavGroupData[];
  bottomItems: NavItemData[];
  user: SidebarUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const allItems = useMemo(() => flattenItems([...groups.flatMap((g) => g.items), ...bottomItems]), [groups, bottomItems]);
  const activeTitle = allItems.find((item) => item.href && isItemActive(item, pathname))?.title ?? "Dashboard";

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const openSearch = () => setSearchOpen(true);

  return (
    <div className="flex h-dvh w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside
        inert={collapsed}
        className={`hidden h-full shrink-0 overflow-hidden bg-surface transition-[width] duration-300 ease-in-out md:block ${
          collapsed ? "w-0" : "w-[260px] border-r border-foreground/10"
        }`}
      >
        <SidebarNav groups={groups} bottomItems={bottomItems} user={user} onSearch={openSearch} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[260px] border-r border-foreground/10">
            <SidebarNav
              groups={groups}
              bottomItems={bottomItems}
              user={user}
              onSearch={openSearch}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-foreground/10 bg-surface px-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
              className="cursor-pointer rounded-lg p-1.5 text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground md:hidden"
            >
              <Menu size={18} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Tampilkan sidebar" : "Sembunyikan sidebar"}
              className="hidden cursor-pointer rounded-lg p-1.5 text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground md:block"
            >
              {collapsed ? <PanelLeftOpen size={18} strokeWidth={1.75} /> : <PanelLeftClose size={18} strokeWidth={1.75} />}
            </button>
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-[13px]">
              <span className="text-foreground/40">Dashboard</span>
              <span className="text-foreground/30">/</span>
              <span className="truncate font-semibold text-foreground">{activeTitle}</span>
            </nav>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>

      {searchOpen && <CommandSearch items={allItems.filter((i) => i.href || i.onClick)} onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
