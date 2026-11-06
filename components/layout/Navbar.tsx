"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, Menu, User, Wallet, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const WHATSAPP_URL = "https://wa.me/6285180642043";

const iconBtn =
  "kr-press flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface text-ink shadow-soft transition-colors hover:bg-pill";

// shortcut: no gender/avatar field on User, so pick one of two avatars from the email; add a profile choice when needed
function avatarFor(key: string) {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) | 0;
  return (h & 1) === 0 ? "/avatars/female.png" : "/avatars/male.png";
}

// Logo PNG berlatar transparan dengan teks gelap: di dark mode diberi latar putih agar terbaca.
function Logo() {
  return (
    <Image
      src="/logo_website.png"
      alt="KampusRebahan"
      width={184}
      height={46}
      loading="eager"
      className="h-10 w-[155px] object-contain dark:rounded-[4px] dark:bg-white dark:p-1 lg:h-[46px] lg:w-[184px]"
    />
  );
}

export default function Navbar() {
  const pathname = usePathname(),
    router = useRouter();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false),
    [dropdownOpen, setDropdownOpen] = useState(false),
    [balance, setBalance] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const pendingRef = useRef<HTMLElement | null>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null),
    [hover, setHover] = useState<{ x: number; w: number; show: boolean } | null>(null);
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
    const closeOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node))
        setDropdownOpen(false);
      if (!headerRef.current?.contains(e.target as Node)) setMobileOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
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
    { href: "/products", label: "Produk", external: false },
    { href: "/#cara-beli", label: "Cara beli", external: false },
    { href: "/dashboard/transactions", label: "Riwayat", external: false },
    { href: WHATSAPP_URL, label: "Bantuan", external: true },
  ];
  const active = (href: string) =>
    !href.includes("#") && !href.startsWith("http") && pathname.startsWith(href);
  const activeIndex = links.findIndex((l) => active(l.href));
  useEffect(() => {
    const measure = () => {
      const el = pendingRef.current ?? itemRefs.current[activeIndex];
      setPill(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
    };
    measure();
    // re-measure when fonts load or the nav resizes, so the pill stays aligned
    const ro = new ResizeObserver(measure);
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
  }, [activeIndex]);
  const showHover = (el: HTMLElement) =>
    setHover({ x: el.offsetLeft, w: el.offsetWidth, show: true });
  const rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
  const linkProps = (l: (typeof links)[number]) =>
    l.external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : { "aria-current": active(l.href) ? ("page" as const) : undefined };
  const itemClass =
    "flex min-h-11 items-center gap-2 rounded-2xl px-3 text-sm font-medium text-ink transition-colors hover:bg-pill aria-[current=page]:bg-pill aria-[current=page]:font-semibold";
  return (
    <header
      ref={headerRef}
      className="relative z-50"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <Link href="/" onClick={close} aria-label="KampusRebahan — Beranda" className="shrink-0">
          <Logo />
        </Link>
        <nav
          ref={navRef}
          className="relative hidden items-center gap-1 whitespace-nowrap rounded-full bg-surface p-1.5 shadow-soft md:flex"
          aria-label="Navigasi utama"
          onMouseLeave={() => setHover((h) => h && { ...h, show: false })}
        >
          <span
            aria-hidden="true"
            className={`absolute inset-y-1.5 left-0 rounded-full bg-pill transition-[transform,width,opacity] duration-[350ms] ease-[var(--kr-ease)] ${hover?.show ? "opacity-100" : "opacity-0"}`}
            style={hover ? { width: hover.w, transform: `translateX(${hover.x}px)` } : undefined}
          />
          {pill && (
            <span
              aria-hidden="true"
              className="absolute inset-y-1.5 left-0 rounded-full bg-ink transition-[transform,width] duration-[350ms] ease-[var(--kr-ease)]"
              style={{ width: pill.w, transform: `translateX(${pill.x}px)` }}
            />
          )}
          {links.map((l, i) => (
            <Link
              key={l.label}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              href={l.href}
              onClick={(e) => {
                // each page mounts its own Navbar, so slide now while the next page loads
                if (!l.external && !l.href.includes("#")) {
                  const el = e.currentTarget;
                  pendingRef.current = el;
                  setPill({ x: el.offsetLeft, w: el.offsetWidth });
                }
                close();
              }}
              onMouseEnter={(e) => showHover(e.currentTarget)}
              onFocus={(e) => showHover(e.currentTarget)}
              className="relative z-10 rounded-full px-[18px] py-2.5 text-sm font-medium text-ink transition-colors duration-300 aria-[current=page]:font-semibold aria-[current=page]:text-on-ink"
              {...linkProps(l)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 md:gap-2.5">
          <ThemeToggle />
          {status === "authenticated" ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                type="button"
                className={`${iconBtn} overflow-hidden`}
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="Menu akun"
                aria-expanded={dropdownOpen}
                aria-controls="account-menu"
              >
                <Image
                  src={avatarFor(session.user?.email ?? session.user?.name ?? "")}
                  alt=""
                  width={44}
                  height={44}
                  className="size-full object-cover"
                />
              </button>
              {dropdownOpen && (
                <div
                  id="account-menu"
                  className="kr-fade-in absolute right-0 top-full mt-3 w-64 rounded-3xl bg-surface p-3 shadow-card"
                >
                  <p className="truncate px-3 pt-2 text-[13px] text-muted">
                    {session.user?.name ?? "Akun saya"}
                  </p>
                  <p className="px-3 pb-2 font-display text-xl font-bold text-ink">
                    {balance == null ? "—" : rupiah.format(balance)}
                  </p>
                  <Link href="/dashboard" onClick={close} className={itemClass}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link
                    href="/dashboard/balance"
                    onClick={close}
                    className={itemClass}
                  >
                    <Wallet size={16} /> Top Up Saldo
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className={`${itemClass} w-full text-danger`}
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : status !== "loading" ? (
            <Link
              href="/auth/signin"
              aria-label="Masuk"
              className={`${iconBtn} hidden md:flex`}
            >
              <User size={18} />
            </Link>
          ) : null}
          <button
            type="button"
            className={`${iconBtn} md:hidden`}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          id="mobile-menu"
          className="kr-fade-in absolute inset-x-0 top-full mt-3 flex flex-col rounded-3xl bg-surface p-3 shadow-card md:hidden"
          aria-label="Navigasi seluler"
        >
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={close}
              className={itemClass}
              {...linkProps(l)}
            >
              {l.label}
            </Link>
          ))}
          <div className="my-2 border-t border-hairline" />
          {status === "authenticated" ? (
            <>
              <p className="flex items-center gap-3 px-3 pt-1 text-[13px] text-muted">
                <Image
                  src={avatarFor(session.user?.email ?? session.user?.name ?? "")}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 rounded-full border border-hairline"
                />
                Saldo {balance == null ? "—" : rupiah.format(balance)}
              </p>
              <Link href="/dashboard" onClick={close} className={itemClass}>
                Dashboard
              </Link>
              <Link
                href="/dashboard/balance"
                onClick={close}
                className={itemClass}
              >
                Saldo akun
              </Link>
              <button
                type="button"
                className={`${itemClass} w-full text-danger`}
                onClick={logout}
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" onClick={close} className={itemClass}>
                Masuk
              </Link>
              <Link href="/auth/signup" onClick={close} className={itemClass}>
                Buat Akun
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
