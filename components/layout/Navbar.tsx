"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  ChevronDown,
  LogOut,
  Menu,
  X,
  Wallet,
  LayoutDashboard,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname(),
    router = useRouter();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false),
    [dropdownOpen, setDropdownOpen] = useState(false),
    [balance, setBalance] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    fetch("/api/balance")
      .then((r) => r.json())
      .then((d) => {
        if (active && d.success) setBalance(d.data.balance);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [status]);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const close = () => {
    setMobileOpen(false);
    setDropdownOpen(false);
  };
  async function logout() {
    await signOut({ redirect: false });
    close();
    router.push("/");
    router.refresh();
  }
  const links = [
    { href: "/", label: "Beranda" },
    { href: "/products", label: "Produk" },
    { href: "/#cara-beli", label: "Cara Beli" },
    { href: "/dashboard", label: "Dashboard" },
  ];
  const active = (href: string) =>
    href === "/"
      ? pathname === "/"
      : !href.includes("#") && pathname.startsWith(href);
  return (
    <header
      className="kr-nav sticky top-0 z-50"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <div className="kr-container kr-nav-inner">
        <Link href="/" onClick={close} aria-label="KampusRebahan — Beranda">
          <Image
            src="/logo_website.png"
            alt="KampusRebahan"
            width={184}
            height={46}
            className="kr-logo"
            priority
          />
        </Link>
        <nav
          className="hidden lg:flex items-center gap-7"
          aria-label="Navigasi utama"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              className="kr-nav-link"
              aria-current={active(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {status === "authenticated" ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 text-xs min-h-11 max-w-[170px]"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-expanded={dropdownOpen}
                aria-controls="account-menu"
              >
                <span className="truncate">
                  {session.user?.name ?? "Akun saya"}
                </span>
                <ChevronDown size={15} />
              </button>
              {dropdownOpen && (
                <div
                  id="account-menu"
                  className="absolute right-0 top-full mt-3 w-64 rounded-lg border border-foreground/15 bg-surface p-5 shadow-lg"
                >
                  <p className="kr-muted text-xs">Saldo akun</p>
                  <p className="text-xl my-2">
                    {balance == null
                      ? "—"
                      : new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(balance)}
                  </p>
                  <Link
                    href="/dashboard"
                    onClick={close}
                    className="flex items-center gap-2 py-3 text-sm"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link
                    href="/dashboard/balance"
                    onClick={close}
                    className="flex items-center gap-2 py-3 text-sm"
                  >
                    <Wallet size={16} /> Top Up Saldo
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 py-3 text-sm text-primary"
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : status !== "loading" ? (
            <div className="hidden md:flex items-center gap-5">
              <Link href="/auth/signin" className="text-xs">
                Masuk
              </Link>
              <Link href="/products" className="kr-link">
                Beli Sekarang
              </Link>
            </div>
          ) : null}
          <button
            type="button"
            className="lg:hidden flex h-11 w-11 items-center justify-center rounded-md border border-foreground/15"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          id="mobile-menu"
          className="kr-mobile-nav lg:hidden"
          aria-label="Navigasi seluler"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              aria-current={active(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard/balance" onClick={close}>
                Saldo akun
              </Link>
              <button
                className="text-left px-2 py-3 text-primary"
                onClick={logout}
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" onClick={close}>
                Masuk
              </Link>
              <Link href="/auth/signup" onClick={close}>
                Buat Akun
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
