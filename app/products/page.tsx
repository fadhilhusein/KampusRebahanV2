"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  TriangleAlert,
  RotateCw,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Product } from "@/lib/types";
function ProductsCatalog({ initialCategory }: { initialCategory: string }) {
  const [products, setProducts] = useState<Product[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [category, setCategory] = useState(initialCategory),
    [page, setPage] = useState(1),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    fetch("/api/products").then(async response => {
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("Katalog belum dapat dimuat. Coba lagi.");
      if (active) setProducts(result.data);
    }).catch(error => {
      if (active) setError(error instanceof Error ? error.message : "Gagal memuat katalog.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) &&
          (!category || p.category === category),
      ),
    [products, search, category],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 8)),
    currentPage = Math.min(page, pages),
    visible = filtered.slice((currentPage - 1) * 8, currentPage * 8);
  function chooseCategory(value: string) {
    setCategory(value);
    setPage(1);
  }
  const pageBtn =
    "kr-press inline-flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-semibold disabled:opacity-50 md:h-10 md:w-10";
  return (
    <div className="kr-page">
      <Navbar />
      <main className="flex w-full min-w-0 flex-1 flex-col gap-6 py-8 md:gap-8 md:py-10">
        <div className="kr-fade-up flex flex-col items-center gap-3 text-center">
          <h1 className="text-4xl font-bold tracking-[-1.5px] text-ink md:text-[64px] md:tracking-[-3px]">
            Semua produk
          </h1>
          <p className="text-sm text-muted md:text-base" role="status">
            {loading
              ? "Memuat produk..."
              : `${filtered.length} produk tersedia. Harga sudah termasuk biaya layanan.`}
          </p>
        </div>
        <div className="kr-fade-up flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6" style={{ animationDelay: "80ms" }}>
          <label className="kr-search">
            <span className="sr-only">Cari produk</span>
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari produk, mis. Netflix"
            />
          </label>
          <div
            role="group"
            aria-label="Filter kategori"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-end md:overflow-visible md:px-0"
          >
            {["", ...categories].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => chooseCategory(c)}
                className="kr-chip kr-press shrink-0"
              >
                {c || "Semua"}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div
            role="status"
            aria-label="Memuat produk"
            className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
          >
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex flex-col gap-2.5 rounded-[22px] bg-surface p-2 shadow-card md:gap-3.5 md:rounded-[28px] md:p-3">
                <Skeleton radius="rounded-[16px]" className="aspect-square w-full md:aspect-auto md:h-[180px]" />
                <Skeleton className="mx-1.5 h-3.5 w-3/4" />
                <Skeleton className="mx-1.5 mb-1.5 h-3.5 w-24" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="kr-fade-up flex flex-col items-center gap-3 rounded-[28px] bg-surface p-7 text-center shadow-card">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-bg text-danger">
              <TriangleAlert size={24} aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold text-ink">Produk gagal dimuat</h2>
            <p className="text-sm text-muted">{error}</p>
            <ButtonPrimary
              variant="secondary"
              onClick={() => { setLoading(true); setError(""); setRetry(value => value + 1); }}
            >
              <RotateCw size={16} aria-hidden="true" /> Coba lagi
            </ButtonPrimary>
          </div>
        ) : !filtered.length ? (
          <div className="kr-fade-up flex flex-col items-center gap-3 rounded-[28px] bg-surface p-7 text-center shadow-card">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pill text-ink">
              <Inbox size={24} aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold text-ink">Produk tidak ditemukan</h2>
            <p className="text-sm text-muted">Coba kata kunci atau kategori lain.</p>
          </div>
        ) : (
          <>
            {/* key: kartu masuk bertahap lagi saat kategori/halaman berganti, tidak saat mengetik */}
            <div key={`${category}-${currentPage}`} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {visible.map((p, i) => (
                <div key={p.id} className="kr-fade-up kr-lift h-full" style={{ animationDelay: `${i * 50}ms` }}>
                  <ProductCard product={p} className="h-full" />
                </div>
              ))}
            </div>
            <nav className="flex items-center justify-center gap-2" aria-label="Halaman katalog">
              <button
                aria-label="Halaman sebelumnya"
                className={`${pageBtn} bg-pill text-ink hover:bg-pill-hover`}
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  aria-label={`Halaman ${i + 1}`}
                  aria-current={currentPage === i + 1 ? "page" : undefined}
                  className={`${pageBtn} ${currentPage === i + 1 ? "bg-ink text-on-ink" : "bg-pill text-ink hover:bg-pill-hover"}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                aria-label="Halaman berikutnya"
                className={`${pageBtn} bg-pill text-ink hover:bg-pill-hover`}
                disabled={currentPage === pages}
                onClick={() => setPage(currentPage + 1)}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </nav>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
function ProductsContent() {
  const params = useSearchParams();
  const category = params.get("category") ?? "";
  return <ProductsCatalog key={category} initialCategory={category} />;
}
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-card" />}>
      <ProductsContent />
    </Suspense>
  );
}
