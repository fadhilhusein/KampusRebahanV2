"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientBorder from "@/components/ui/GradientBorder";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import Badge from "@/components/ui/Badge";
import VariantSelector from "@/components/product/VariantSelector";
import { ProductDetailSkeleton } from "@/components/ui/Skeleton";
import { getCategoryIcon, getCategoryColor } from "@/lib/categoryIcons";
import type { Product, ProductVariant } from "@/lib/types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selected, setSelected] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const found = data.data.find((p: Product) => p.id === id);
          if (found) {
            setProduct(found);
            document.title = `${found.name} | KampusRebahan`;
            const firstInStock = found.variants.find((v: ProductVariant) => v.stock > 0);
            setSelected(firstInStock ?? found.variants[0] ?? null);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-24 pb-16 px-8">
          <ProductDetailSkeleton />
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-24 pb-16 px-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/40 mb-4">Produk tidak ditemukan.</p>
            <Link href="/products">
              <ButtonPrimary>Kembali ke Produk</ButtonPrimary>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const icon = getCategoryIcon(product.category);
  const color = getCategoryColor(product.category);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[12px] text-white/30 mb-8">
            <Link href="/products" className="hover:text-white transition-colors">
              Produk
            </Link>
            <span>/</span>
            <span className="text-white/60">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left — Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-[2px] glass flex items-center justify-center text-[24px]">
                  {icon}
                </div>
                <Badge color={color}>{product.category}</Badge>
              </div>

              <h1 className="text-[32px] font-semibold text-white leading-tight tracking-tight mb-4">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-[14px] text-white/50 leading-6 mb-6">
                  {product.description}
                </p>
              )}

              {selected && (
                <GlassCard className="p-5 mb-6">
                  <div className="text-[11px] text-white/30 mb-1">Harga terpilih</div>
                  <div className="text-[28px] font-semibold text-white">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(selected.price)}
                  </div>
                  <div className="text-[12px] text-white/40 mt-1">
                    {selected.duration} · {selected.type}
                    {selected.warranty ? ` · Garansi ${selected.warranty}` : ""}
                  </div>
                </GlassCard>
              )}

              <ButtonPrimary
                className="w-full py-3 text-[14px] justify-center"
                disabled={!selected || selected.stock === 0}
                onClick={() => {
                  if (selected)
                    router.push(
                      `/checkout?variant_id=${selected.id}&product_id=${product.id}`
                    );
                }}
              >
                {selected?.stock === 0 ? "Stok Habis" : "Beli Sekarang"}
              </ButtonPrimary>

              {/* Terms accordion */}
              {selected?.terms && (
                <div className="mt-6">
                  <button
                    onClick={() => setTermsOpen(!termsOpen)}
                    className="w-full flex items-center justify-between text-[13px] text-white/50 hover:text-white transition-colors py-3 border-t border-white/8 cursor-pointer"
                  >
                    <span>Syarat & Ketentuan</span>
                    <span>{termsOpen ? "−" : "+"}</span>
                  </button>
                  {termsOpen && (
                    <div className="text-[12px] text-white/40 leading-5 pb-3 whitespace-pre-line">
                      {selected.terms}
                    </div>
                  )}
                  {selected.delivery_terms && (
                    <div className="text-[12px] text-white/40 leading-5 pb-3 border-t border-white/8 pt-3 whitespace-pre-line">
                      <span className="text-white/50 font-medium block mb-1">
                        Info Pengiriman
                      </span>
                      {selected.delivery_terms}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right — Variant selector */}
            <div>
              <GradientBorder>
                <div className="p-5">
                  <h2 className="text-[14px] font-medium text-white/60 mb-4">
                    Pilih Varian
                  </h2>
                  <VariantSelector
                    variants={product.variants}
                    selected={selected}
                    onSelect={setSelected}
                  />
                </div>
              </GradientBorder>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
