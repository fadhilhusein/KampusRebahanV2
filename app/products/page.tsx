"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  RotateCw,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
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
  return (
    <>
      <Navbar />
      <main className="kr-container flex-1 py-12 md:py-14">
        <nav aria-label="Breadcrumb" className="kr-muted text-xs mb-8">
          <Link href="/">Beranda</Link> / Produk
        </nav>
        <p className="kr-eyebrow mb-4">Pilih kebutuhanmu</p>
        <h1 className="kr-heading">Semua produk, satu tempat.</h1>
        <p className="kr-muted mt-4 mb-8 text-sm">
          Akses hiburan, produktivitas, dan AI untuk keseharianmu.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-5">
          <label className="relative flex-1">
            <span className="sr-only">Cari produk</span>
            <Search
              size={18}
              className="absolute left-4 top-4 text-foreground/50"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari produk..."
              className="w-full min-h-[52px] border border-foreground/20 rounded-md bg-surface pl-12 pr-4 text-sm"
            />
          </label>
          <label>
            <span className="sr-only">Kategori produk</span>
            <select
              value={category}
              onChange={(e) => chooseCategory(e.target.value)}
              className="h-[52px] w-full rounded-md border border-foreground/20 bg-surface px-4 text-sm"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2 mb-7" aria-label="Filter kategori">
          {["", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => chooseCategory(c)}
              className={`min-h-11 rounded-md border px-3 text-xs transition-colors ${category === c ? "border-primary bg-primary text-white [data-theme=dark]:text-black" : "border-foreground/15 bg-surface text-foreground/60"}`}
            >
              {c || "Semua"} ·{" "}
              {c
                ? products.filter((p) => p.category === c).length
                : products.length}
            </button>
          ))}
        </div>
        <p className="text-xs kr-muted mb-7" role="status">
          {loading ? "Memuat produk..." : `${filtered.length} produk tersedia`}
        </p>
        {loading ? (
          <div className="kr-product-grid">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="aspect-[3/5] rounded-lg bg-foreground/5 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="glass p-10 rounded-lg text-center">
            <p className="mb-4">{error}</p>
            <button onClick={() => { setLoading(true); setError(""); setRetry(value => value + 1); }} className="kr-link">
              <RotateCw size={16} /> Coba Lagi
            </button>
          </div>
        ) : !filtered.length ? (
          <div className="py-20 text-center">
            <PackageSearch size={36} className="mx-auto mb-4 text-primary" />
            <h2 className="text-xl">Produk tidak ditemukan.</h2>
            <p className="kr-muted text-sm mt-3">
              Coba kata kunci atau kategori lain.
            </p>
          </div>
        ) : (
          <>
            <div className="kr-product-grid">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs kr-muted">
                Menampilkan {(currentPage - 1) * 8 + 1}–
                {Math.min(currentPage * 8, filtered.length)} dari{" "}
                {filtered.length} produk
              </p>
              <nav
                className="flex items-center gap-2"
                aria-label="Halaman katalog"
              >
                <button
                  aria-label="Halaman sebelumnya"
                  className="kr-link kr-link-outline !px-3 disabled:opacity-40"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    key={i}
                    aria-label={`Halaman ${i + 1}`}
                    aria-current={currentPage === i + 1 ? "page" : undefined}
                    className={`h-11 w-10 rounded-md border text-xs ${currentPage === i + 1 ? "bg-btn-fill text-white border-transparent" : "border-foreground/15"}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  aria-label="Halaman berikutnya"
                  className="kr-link kr-link-outline !px-3 disabled:opacity-40"
                  disabled={currentPage === pages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
function ProductsContent() {
  const params = useSearchParams();
  const category = params.get("category") ?? "";
  return <ProductsCatalog key={category} initialCategory={category} />;
}
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductsContent />
    </Suspense>
  );
}
