"use client";
import { Circle, CheckCircle2, LockKeyhole } from "lucide-react";
import type { ProductVariant } from "@/lib/types";
export default function VariantSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (v: ProductVariant) => void;
  radius?: string;
}) {
  return (
    <div className="space-y-3" role="group" aria-label="Pilihan varian">
      {variants.map((v) => {
        const active = selected?.id === v.id,
          out = v.stock === 0;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v)}
            disabled={out}
            aria-pressed={active}
            className={`w-full rounded-md border p-4 md:p-5 text-left transition-colors disabled:cursor-not-allowed ${active ? "border-primary bg-primary/5" : "border-foreground/15 hover:border-primary/50"} ${out ? "bg-foreground/5 text-foreground/50" : ""}`}
          >
            <div className="flex gap-3 items-start">
              {active ? (
                <CheckCircle2
                  size={18}
                  className="text-primary mt-0.5 shrink-0"
                />
              ) : (
                <Circle
                  size={18}
                  className="text-foreground/40 mt-0.5 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-sm font-medium">{v.name}</span>
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(v.price)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs kr-muted mt-3">
                  <span>{v.duration}</span>
                  <span className="inline-flex gap-1 items-center">
                    {v.type.toLowerCase() === "private" && (
                      <LockKeyhole size={12} />
                    )}{" "}
                    {v.type}
                  </span>
                  {v.warranty && <span>Garansi {v.warranty}</span>}
                </div>
                <p
                  className={`mt-3 text-xs ${out ? "kr-muted" : "text-primary"}`}
                >
                  {out ? "Habis" : `Stok ${v.stock}`}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
