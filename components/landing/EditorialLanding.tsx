import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ShoppingBag,
  CreditCard,
  KeyRound,
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

export default function EditorialLanding({
  products,
}: {
  products: Product[];
}) {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  return (
    <>
      <section className="kr-hero">
        <div className="kr-container">
          <div className="kr-hero-copy">
            <p className="kr-eyebrow">Akses digital, harga mahasiswa</p>
            <h1>
              Premium untuk harimu.
              <br />
              Tetap ramah di kantong.
            </h1>
            <p>
              Netflix, Spotify, Disney+, dan puluhan layanan digital premium
              lainnya. Temukan akses untuk hiburan, belajar, dan berkarya dalam
              satu tempat.
            </p>
            <div className="kr-hero-actions">
              <Link className="kr-link" href="/products">
                Lihat Semua Produk <ArrowRight size={16} />
              </Link>
              <Link className="kr-link kr-link-outline" href="/auth/signup">
                Buat Akun
              </Link>
            </div>
          </div>
        </div>
        <div className="kr-spectrum" aria-hidden="true" />
        <div className="kr-hero-base">
          <div className="kr-container">
            <div className="kr-hero-meta">
              <div>
                <p>PILIHAN PRODUK DIGITAL</p>
                <strong>
                  {products.length
                    ? products.length + " layanan, satu tempat."
                    : "Pilihan untuk keseharianmu."}
                </strong>
              </div>
              <div>
                <p>AKSES SESUAI KEBUTUHAN</p>
                <strong>Pilih paket yang pas.</strong>
              </div>
            </div>
            <div className="kr-hero-categories">
              {(categories.length
                ? categories
                : [
                    "Streaming",
                    "Music",
                    "Productivity",
                    "Education",
                    "Utility",
                    "Domain",
                  ]
              ).map((c) => (
                <span key={c}>{c.toUpperCase()}</span>
              ))}
            </div>
          </div>
        </div>
        <Image
          className="kr-hero-image"
          src="/landing/hero-final.png"
          width={644}
          height={720}
          alt="Panel akses digital di atas podium"
          priority
        />
      </section>
      <section className="kr-container kr-intro">
        <div>
          <p className="kr-eyebrow">Rebahan tetap produktif</p>
          <Image
            src="/landing/access-final.png"
            width={550}
            height={350}
            alt="Kartu akses digital dengan platform merah"
          />
        </div>
        <div>
          <h2 className="kr-heading">
            Lebih banyak pilihan.
            <br />
            Lebih ringan di kantong.
          </h2>
          <p>
            Dari tontonan favorit sampai alat bantu berkarya, pilih layanan
            digital yang sesuai kebutuhanmu. KampusRebahan menghadirkan pilihan
            premium dengan harga yang tetap bersahabat untuk mahasiswa.
          </p>
          <Link href="/products" className="kr-link kr-link-dark">
            Jelajahi Koleksi <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <div className="kr-spectrum" aria-hidden="true" />
      <section className="kr-container kr-products" id="produk">
        <div className="kr-section-head">
          <div>
            <p className="kr-eyebrow">Pilih akses favoritmu</p>
            <h2 className="kr-heading">Produk pilihan untuk harimu.</h2>
          </div>
          <Link href="/products" className="kr-link kr-link-outline">
            Lihat Semua Produk <ArrowUpRight size={16} />
          </Link>
        </div>
        {products.length ? (
          <div className="kr-product-grid">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-lg p-8">
            <p className="kr-muted">Katalog belum dapat dimuat.</p>
            <Link href="/products" className="mt-4 kr-link">
              Buka Katalog
            </Link>
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c}
              href={"/products?category=" + encodeURIComponent(c)}
              className="kr-link kr-link-outline"
            >
              {c}
              <span className="kr-muted text-xs">
                {products.filter((p) => p.category === c).length}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="kr-services" aria-label="Pilihan layanan">
        <article className="kr-service">
          <div className="kr-service-copy">
            <div>
              <p className="kr-eyebrow mb-5">Waktu santai</p>
              <h2 className="kr-heading">
                Tontonan dan musik.
                <br />
                Teman rebahan terbaik.
              </h2>
              <p className="mt-6">
                Temukan layanan streaming untuk film, serial, dan musik yang
                ingin kamu nikmati.
              </p>
            </div>
            <ul>
              {[
                "Film dan serial favorit",
                "Musik untuk setiap suasana",
                "Pilihan paket sesuai kebutuhan",
              ].map((t) => (
                <li key={t} className="flex gap-3 items-center">
                  <Check size={15} className="text-primary" />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              className="kr-link kr-link-dark"
              href="/products?category=Streaming"
            >
              Lihat Layanan Streaming <ArrowRight size={16} />
            </Link>
          </div>
          <Image
            src="/landing/entertainment-final.png"
            width={590}
            height={480}
            alt="Ruang kaca dengan simbol pemutar video"
          />
        </article>
        <article className="kr-service kr-service-reverse">
          <Image
            src="/landing/productivity-final.png"
            width={590}
            height={480}
            alt="Ruang kaca berisi alat kreativitas"
          />
          <div className="kr-service-copy">
            <div>
              <p className="kr-eyebrow mb-5">Belajar dan berkarya</p>
              <h2 className="kr-heading">
                Untuk ide
                <br />
                yang terus jalan.
              </h2>
              <p className="mt-6">
                Dukung tugas, proyek kreatif, dan pekerjaan harian dengan alat
                bantu digital pilihanmu.
              </p>
            </div>
            <ul>
              {[
                "Desain dan editing",
                "Alat bantu produktivitas",
                "Layanan AI untuk berkarya",
              ].map((t) => (
                <li key={t} className="flex gap-3 items-center">
                  <Check size={15} className="text-primary" />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              className="kr-link kr-link-dark"
              href="/products?category=Productivity"
            >
              Lihat Layanan Produktivitas <ArrowRight size={16} />
            </Link>
          </div>
        </article>
      </section>
      <section className="kr-container kr-steps" id="cara-beli">
        <p className="kr-eyebrow">Cara pembelian</p>
        <h2 className="kr-heading mt-4">Dari pilih, sampai siap dipakai.</h2>
        <div className="kr-step-grid">
          {[
            {
              Icon: ShoppingBag,
              title: "Pilih produk",
              text: "Temukan layanan dan varian yang sesuai kebutuhan. Periksa stok dan ketentuannya.",
            },
            {
              Icon: CreditCard,
              title: "Selesaikan pembayaran",
              text: "Periksa pesanan, lalu bayar dengan metode yang tersedia saat checkout.",
            },
            {
              Icon: KeyRound,
              title: "Buka aksesmu",
              text: "Pantau status pesanan dan lihat informasi akses setelah pesanan selesai diproses.",
            },
          ].map(({ Icon, title, text }, i) => (
            <article className="kr-step" key={title}>
              <div className="flex items-center justify-between">
                <span>0{i + 1}</span>
                <Icon size={20} className="text-primary" />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="kr-closing">
        <div className="max-w-[1312px] mx-auto">
          <p className="kr-eyebrow !text-[#FFADB5]">Akses untuk keseharianmu</p>
          <h2 className="kr-heading">
            Saatnya pilih aksesmu.
            <br />
            Bikin harimu lebih premium.
          </h2>
          <p>Pilih layanan digital sesuai kebutuhan dan budget kamu.</p>
          <Link href="/products" className="kr-link">
            Temukan Produkmu <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
