import Link from "next/link";
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
    text: "Cari akun yang dibutuhkan, pilih durasi.",
    short: "Cari akun, pilih durasi.",
  },
  {
    title: "Bayar QRIS atau saldo",
    text: "Scan QR dari e-wallet atau bank apa pun.",
    short: "Scan dari e-wallet atau bank.",
  },
  {
    title: "Terima kredensial",
    text: "Email dan password tampil otomatis setelah lunas.",
    short: "Tampil otomatis setelah lunas.",
  },
];

function minPrice(p: Product) {
  return p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : null;
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
        className="flex scroll-mt-6 flex-col gap-6 md:flex-row md:gap-16 md:pt-10"
      >
        <Reveal className="md:w-[420px] md:shrink-0">
          <p className="text-xs font-semibold uppercase tracking-[1.2px] text-muted">Cara beli</p>
          <h2 className="mt-2 text-[28px] font-bold tracking-[-1px] text-ink md:text-[44px] md:tracking-[-1.5px]">
            Tiga langkah,
            <br />
            kurang dari 2 menit.
          </h2>
          <p className="mt-3 max-w-[400px] text-base text-muted max-md:hidden">
            Dari pilih akun sampai kredensial siap dipakai, semuanya dari satu tempat.
          </p>
        </Reveal>
        <Reveal as="ol" stagger={0.1} delay={0.1} className="flex-1">
          {steps.map((s, i) => (
            <RevealItem
              as="li"
              key={s.title}
              className="flex items-center gap-4 border-b border-hairline py-5 md:gap-6 md:py-6"
            >
              <span className="w-10 shrink-0 font-display text-[28px] font-bold text-muted md:w-12 md:text-[40px]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-ink md:text-xl">{s.title}</h3>
                <p className="text-[13px] text-muted md:text-sm">
                  <span className="md:hidden">{s.short}</span>
                  <span className="hidden md:inline">{s.text}</span>
                </p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      <RecentPurchaseBanner />
    </div>
  );
}
