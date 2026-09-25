"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { LogOut } from "lucide-react";
import { motion } from "motion/react";

// Transaksi and Admin live inside the dashboard now.
const LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Produk" },
  { href: "/dashboard", label: "Dashboard" },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  async function fetchBalance() {
    try {
      const res = await fetch("/api/balance");
      const data = await res.json();
      if (data.success) setBalance(data.data.balance);
    } catch {
      // ignore, keep last known balance
    }
  }

  useEffect(() => {
    if (status === "authenticated") fetchBalance();
  }, [status]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="navbar-surface glass border-b border-foreground/8 backdrop-blur-[12px]">
        <div className="relative max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            {/* <span className="text-foreground font-semibold text-[14px] tracking-tight">
              Kampus<span className="text-primary">Rebahan</span>
            </span> */}
            <img
              src="/logo_website.png"
              alt="Kampus Rebahan"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex absolute items-center gap-6"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[12px] font-medium transition-colors duration-150 ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {status === "authenticated" ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setDropdownOpen((v) => !v);
                      if (!dropdownOpen) fetchBalance();
                    }}
                    className="text-[12px] text-foreground/40 max-w-[140px] truncate border-r border-foreground/20 pr-3 hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
                  >
                    Halo, {session.user?.name ?? session.user?.email}
                    <span className="text-foreground/30">▾</span>
                  </button>

                  <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{
                      opacity: dropdownOpen ? 1 : 0,
                      y: dropdownOpen ? 0 : -10
                    }}
                    className="absolute right-0 top-full mt-2 w-56 bg-surface border border-foreground/10 rounded-xl p-4 shadow-xl"
                  >
                    <div className="text-[11px] text-foreground/30 uppercase tracking-wider mb-1">
                      Saldo
                    </div>
                    <div className="text-[18px] font-semibold text-foreground mb-3">
                      {formatPrice(balance)}
                    </div>
                    <Link
                      href="/dashboard/balance"
                      onClick={() => setDropdownOpen(false)}
                      className="block text-center text-[12px] text-foreground bg-foreground/10 hover:bg-foreground/15 rounded-[2px] px-3 py-2 transition-colors"
                    >
                      Top Up Saldo
                    </Link>
                  </motion.div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-[12px] text-foreground hover:text-red-400 font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  Keluar <LogOut size={14} className="inline-block" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/auth/signin">
                  <span className="text-[12px] text-foreground/50 hover:text-foreground transition-colors cursor-pointer">
                    Masuk
                  </span>
                </Link>
                <Link href="/products">
                  <ButtonPrimary>Beli Sekarang</ButtonPrimary>
                </Link>
              </div>
            )}

            <ThemeToggle />

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-1 cursor-pointer"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-px w-5 bg-foreground transition-all duration-200 origin-center ${
                  mobileOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-foreground transition-all duration-200 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-foreground transition-all duration-200 origin-center ${
                  mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-foreground/8 px-6 py-4 flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-[14px] font-medium py-2.5 transition-colors duration-150 ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-foreground/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-foreground/8 mt-1 space-y-2">
              {status === "authenticated" ? (
                <>
                  <div className="text-[12px] text-foreground/30 py-1">
                    {session.user?.name ?? session.user?.email}
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[12px] text-foreground/30">
                      Saldo
                    </span>
                    <span className="text-[13px] font-semibold text-foreground">
                      {formatPrice(balance)}
                    </span>
                  </div>
                  <Link
                    href="/dashboard/balance"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center text-[13px] text-foreground bg-foreground/10 hover:bg-foreground/15 rounded-[2px] px-3 py-2 transition-colors"
                  >
                    Top Up Saldo
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                    className="text-[14px] text-foreground/50 py-2 text-left cursor-pointer flex items-center gap-1"
                  >
                    Keluar <LogOut size={14} className="inline-block" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ButtonPrimary variant="ghost" className="w-full py-2.5">
                      Masuk
                    </ButtonPrimary>
                  </Link>
                  <Link href="/products" onClick={() => setMobileOpen(false)}>
                    <ButtonPrimary className="w-full py-2.5">
                      Beli Sekarang
                    </ButtonPrimary>
                  </Link>
                </>
              )}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[12px] text-foreground/30">Tema</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
