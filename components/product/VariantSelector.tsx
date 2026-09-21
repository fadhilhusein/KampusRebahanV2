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
  radius?: string;
}

export default function VariantSelector({
  variants,
  selected,
  onSelect,
  radius = "rounded-[2px]"
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
            className={`w-full ${radius} p-4 text-left border transition-all duration-150 cursor-pointer rounded-xl
              ${isSelected
                ? "border-foreground/60 bg-foreground/8"
                : "border-foreground/10 hover:border-foreground/25 bg-transparent"
              }
              ${outOfStock ? "opacity-40 cursor-not-allowed" : ""}
            `}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[14px] font-medium text-foreground">{v.name}</div>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-foreground/10 text-foreground/70">
                    {v.duration}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary/15 text-secondary">
                    {v.type.toLowerCase() === "private" ? "🔏 Private" : v.type}
                  </span>
                  {v.warranty && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-tertiary/15 text-tertiary">
                      Garansi {v.warranty}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[16px] font-semibold text-foreground">
                  {formatPrice(v.price)}
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1.5 ${
                  outOfStock ? "bg-foreground/10 text-foreground/40" : "bg-green-400/15 text-green-500"
                }`}>
                  {outOfStock ? "Habis" : `Stok ${v.stock}`}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
