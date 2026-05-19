"use client";

import type { ProductVariant } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

interface VariantSelectorProps {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (v: ProductVariant) => void;
}

export default function VariantSelector({
  variants,
  selected,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div className="space-y-3">
      {variants.map((v) => {
        const isSelected = selected?.id === v.id;
        const outOfStock = v.stock === 0;

        return (
          <button
            key={v.id}
            onClick={() => !outOfStock && onSelect(v)}
            disabled={outOfStock}
            className={`w-full rounded-[2px] p-4 text-left border transition-all duration-150 cursor-pointer
              ${isSelected
                ? "border-white/60 bg-white/8"
                : "border-white/10 hover:border-white/25 bg-transparent"
              }
              ${outOfStock ? "opacity-40 cursor-not-allowed" : ""}
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[14px] font-medium text-white">{v.name}</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-white/40">{v.duration}</span>
                  <span className="text-[11px] text-white/30">•</span>
                  <span className="text-[11px] text-white/40">{
                    v.type.toLowerCase() === "private" ? "🔏 Private" : v.type
                  }</span>
                  {v.warranty && (
                    <>
                      <span className="text-[11px] text-white/30">•</span>
                      <span className="text-[11px] text-white/40">Garansi {v.warranty}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[16px] font-semibold text-white">
                  {formatPrice(v.price)}
                </div>
                <div className="text-[10px] text-white/30 mt-0.5">
                  {outOfStock ? "Habis" : `Stok ${v.stock}`}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
