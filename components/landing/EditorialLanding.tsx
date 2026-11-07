import { Fragment } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleCheck,
  Copy,
  KeyRound,
  MousePointer2,
  MousePointerClick,
  QrCode,
  ScanLine,
  Timer,
} from "lucide-react";
import PaymentCarousel from "@/components/landing/PaymentCarousel";
import ProductCard from "@/components/product/ProductCard";
import HeroGallery from "@/components/landing/HeroGallery";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import ProductImage from "@/components/product/ProductImage";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import RecentPurchaseBanner from "@/components/landing/RecentPurchaseBanner";
import type { Product } from "@/lib/types";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const steps = [
  {
    title: "Pilih produk dan varian",
    text: "Bandingkan durasi, tipe akun, dan garansi sebelum checkout.",
    icon: MousePointerClick,
    tint: "color-mix(in srgb, var(--color-danger-bg) 85%, transparent)",
  },
  {
    title: "Bayar dengan QRIS atau saldo",
    text: "Scan dari e-wallet atau m-banking apa pun. Status terbaca otomatis.",
    icon: ScanLine,
    tint: "color-mix(in srgb, var(--color-accent) 16%, transparent)",
  },
  {
    title: "Terima kredensial",
    text: "Email dan password tampil di halaman pesanan, salinan dikirim ke email.",
    icon: KeyRound,
    tint: "var(--color-success-bg)",
  },
];

function minPrice(p: Product) {
  return p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : null;
}

const miniCard = "relative rounded-[18px] bg-surface p-3 shadow-card";

function PickVisual({ product }: { product?: Product }) {
  const name = product?.name ?? "Netflix Premium";
  const rows = product?.variants.length
    ? product.variants.slice(0, 2).map((v) => [v.name, v.price] as const)
    : ([["Sharing", 25000], ["Bergaransi", 32000]] as const);
  return (
    <div className={`${miniCard} flex w-[230px] flex-col gap-2`}>
      <div className="flex items-center gap-2.5">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[11px] md:h-10 md:w-10 md:rounded-xl">
          <ProductImage name={name} category={product?.category} sizes="40px" iconSize={18} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-ink">{name}</p>
          <p className="text-xs text-muted">{product?.variants.length ?? 3} varian</p>
        </div>
      </div>
      {rows.map(([label, price], i) => {
        const on = i === rows.length - 1;
        return (
          <div
            key={label}
            className={`flex items-center gap-2 rounded-xl px-2.5 py-2 ${on ? "border-[1.5px] border-accent bg-accent/5" : "border border-hairline"}`}
          >
            <span
              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${on ? "border-accent" : "border-line"}`}
            >
              {on && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{label}</span>
            <span className="text-xs font-bold text-ink">{rupiah.format(price)}</span>
          </div>
        );
      })}
      <MousePointer2 size={22} className="absolute -bottom-3 right-1 fill-surface text-ink" />
    </div>
  );
}

function PayVisual() {
  return (
    <div className={`${miniCard} flex w-[140px] flex-col items-center gap-1.5 md:w-[150px] md:gap-2`}>
      <div className="flex h-[86px] w-[86px] items-center justify-center rounded-xl border-[1.5px] border-ink md:h-24 md:w-24">
        <QrCode size={64} strokeWidth={1.5} className="text-ink" />
      </div>
      <p className="font-display text-[15px] font-bold tracking-[-0.4px] text-ink md:text-base">Rp32.000</p>
      <p className="flex items-center gap-1 text-xs font-semibold text-warn">
        <Timer size={12} /> 14:32
      </p>
      <span className="absolute -left-10 -top-3 rotate-6 rounded-full bg-warn-bg px-3 py-1 text-xs font-semibold text-warn">
        Menunggu bayar
      </span>
      <span className="absolute -bottom-2 -right-10 flex -rotate-[4deg] items-center gap-1 rounded-full bg-success px-2.5 py-[5px] text-xs font-semibold text-white shadow-soft">
        <Check size={12} /> Lunas
      </span>
    </div>
  );
}

function CredentialVisual() {
  return (
    <div className="flex flex-col items-center">
      <div className={`${miniCard} flex w-[240px] flex-col gap-2`}>
        {[
          ["Email", "netflix.kr481@mail.com"],
          ["Password", "••••••••••"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between rounded-[10px] bg-card px-2.5 py-2">
            <div>
              <p className="text-xs font-semibold text-muted">{label}</p>
              <p className="text-xs font-medium text-ink">{value}</p>
            </div>
            <Copy size={14} className="text-ink" />
          </div>
        ))}
      </div>
      <div className="relative -mt-4 flex w-[230px] items-center gap-3 rounded-[20px] bg-ink px-3.5 py-2.5 shadow-card">
        <CircleCheck size={20} className="text-toast-icon" />
        <span className="text-[13px] font-medium text-on-ink">Kredensial terkirim</span>
      </div>
    </div>
  );
}

export default function EditorialLanding({
  products,
}: {
  products: Product[];
}) {
  const best = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="flex flex-col items-center gap-2 text-center">
        <Reveal
          as="h1"
          onMount
          y={24}
          className="max-w-[900px] text-[42px] font-bold leading-none tracking-[-2px] text-ink md:text-[84px] md:leading-[0.98] md:tracking-[-4px]"
        >
          Akun digital premium,
          <br />
          harga mahasiswa.
        </Reveal>

        <HeroGallery products={products} />

        <Reveal
          as="p"
          onMount
          delay={0.25}
          className="max-w-[480px] text-[15px] text-muted md:text-base md:leading-normal"
        >
          <span className="md:hidden">
            Bayar dengan QRIS atau saldo, kredensial langsung dikirim ke dashboard.
          </span>
          <span className="hidden md:inline">
            Beli akun Netflix, Spotify, Canva, dan ratusan layanan lain. Bayar dengan
            QRIS atau saldo, kredensial langsung dikirim ke dashboard.
          </span>
        </Reveal>
        <Reveal
          onMount
          delay={0.35}
          className="flex w-full flex-col gap-2.5 pt-4 md:w-auto md:flex-row md:gap-3 md:pt-6"
        >
          <Link href="/products" className={`kr-press ${buttonClass("primary")}`}>
            Lihat produk
          </Link>
          <Link href="/#cara-beli" className={`kr-press ${buttonClass("secondary")}`}>
            Cara beli
          </Link>
        </Reveal>
      </section>

      <section aria-labelledby="terlaris" className="flex flex-col gap-5 md:gap-7">
        <Reveal className="flex items-center justify-between gap-4">
          <h2
            id="terlaris"
            className="text-[28px] font-bold tracking-[-1px] text-ink md:text-[44px] md:tracking-[-1.5px]"
          >
            Produk terlaris
          </h2>
          <Link href="/products" className={`kr-press max-md:hidden ${buttonClass("secondary")}`}>
            Semua produk
          </Link>
        </Reveal>
        {best.length ? (
          <>
            <Reveal stagger={0.08} className="hidden gap-6 md:grid md:grid-cols-3 lg:grid-cols-4">
              {best.map((p, i) => (
                <RevealItem key={p.id} y={24} className={i === 3 ? "md:max-lg:hidden" : ""}>
                  <div className="kr-lift h-full">
                    <ProductCard product={p} />
                  </div>
                </RevealItem>
              ))}
            </Reveal>
            <Reveal as="ul" stagger={0.06} className="flex flex-col gap-3 md:hidden">
              {best.map((p) => {
                const price = minPrice(p);
                const inStock = p.variants.some((v) => v.stock > 0);
                const href = `/products/${p.id}`;
                return (
                  <RevealItem
                    as="li"
                    key={p.id}
                    className="relative flex items-center gap-3.5 rounded-[22px] bg-surface p-2.5 shadow-card"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                      <ProductImage name={p.name} category={p.category} sizes="64px" iconSize={28} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={href}
                        className="block truncate text-sm font-semibold text-ink after:absolute after:inset-0 after:rounded-[22px]"
                      >
                        {p.name}
                      </Link>
                      <p className="text-[13px] text-muted">
                        {price == null ? "Belum tersedia" : rupiah.format(price)}
                      </p>
                    </div>
                    {inStock ? (
                      <Link href={href} className={`kr-press relative z-10 min-h-11 ${buttonClass("primary", "sm")}`}>
                        Beli
                      </Link>
                    ) : (
                      <span className="rounded-full bg-pill px-4 py-2 text-[13px] font-semibold text-muted">
                        Stok habis
                      </span>
                    )}
                  </RevealItem>
                );
              })}
            </Reveal>
            <Link href="/products" className={`kr-press md:hidden ${buttonClass("secondary")}`}>
              Semua produk
            </Link>
          </>
        ) : (
          <div className="rounded-[28px] bg-surface p-7 text-center shadow-card">
            <p className="text-muted">Katalog belum dapat dimuat.</p>
            <Link href="/products" className={`mt-4 ${buttonClass("primary")}`}>
              Buka katalog
            </Link>
          </div>
        )}
      </section>

      <section
        id="cara-beli"
        aria-labelledby="cara-beli-title"
        className="flex scroll-mt-6 flex-col gap-5 pt-2 md:gap-9 md:pt-10"
      >
        <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[1.2px] text-muted">Cara beli</p>
            <h2
              id="cara-beli-title"
              className="mt-2.5 text-[30px] font-bold leading-[1.05] tracking-[-1.2px] text-ink md:text-[44px] md:tracking-[-1.5px]"
            >
              Tiga langkah,
              <br className="md:hidden" /> langsung pakai.
            </h2>
          </div>
          <p className="text-[15px] leading-normal text-muted md:max-w-[420px] md:text-base">
            Tanpa chat admin. Pilih varian, scan QRIS, dan kredensial muncul sendiri di halaman
            pesanan.
          </p>
        </Reveal>

        <Reveal as="ol" stagger={0.1} className="grid gap-5 md:grid-cols-2 lg:flex lg:items-center lg:gap-0">
          {steps.map((s, i) => (
            <Fragment key={s.title}>
              {i > 0 && (
                <li aria-hidden="true" className="flex w-11 shrink-0 justify-center max-lg:hidden">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-surface text-ink shadow-soft">
                    <ArrowRight size={16} />
                  </span>
                </li>
              )}
              <RevealItem
                as="li"
                y={24}
                className="flex min-w-0 flex-col gap-3.5 rounded-[26px] md:last:col-span-2 lg:flex-1 lg:basis-0 lg:last:col-span-1 bg-surface p-3.5 shadow-card md:gap-5 md:rounded-[28px] md:p-5"
              >
                <div
                  aria-hidden="true"
                  className="flex h-[170px] items-center justify-center overflow-hidden rounded-[18px] md:h-[220px] md:rounded-[20px]"
                  style={{
                    background: `radial-gradient(120% 120% at 50% 35%, ${s.tint}, var(--color-card) 70%)`,
                  }}
                >
                  {i === 0 && <PickVisual product={best[0]} />}
                  {i === 1 && <PayVisual />}
                  {i === 2 && <CredentialVisual />}
                </div>
                <div className="flex flex-col gap-1.5 px-1 pb-1 md:gap-2">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-ink py-[5px] pl-2 pr-3 text-xs font-semibold text-on-ink">
                    <s.icon size={14} aria-hidden="true" />
                    Langkah {i + 1}
                  </span>
                  <h3 className="font-display text-[19px] font-semibold tracking-[-0.5px] text-ink md:text-[21px]">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-normal text-muted">{s.text}</p>
                </div>
              </RevealItem>
            </Fragment>
          ))}
        </Reveal>

        <Reveal>
          <PaymentCarousel />
        </Reveal>
      </section>

      <RecentPurchaseBanner />
    </div>
  );
}
