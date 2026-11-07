"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Landmark } from "lucide-react";

const logos = [
  { name: "QRIS", src: "/payments/qris-logo.png" },
  { name: "GoPay", src: "/payments/gopay.svg" },
  { name: "OVO", src: "/payments/ovo.svg" },
  { name: "DANA", src: "/payments/dana.svg" },
  { name: "ShopeePay", src: "/payments/shopeepay.png" },
  { name: "m-Banking" },
  { name: "Saldo KampusRebahan", src: "/logo_website.png" },
];

export default function PaymentCarousel() {
  const track = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState({ index: 0, count: 1 });

  function measure() {
    const el = track.current;
    if (!el) return;
    const count = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
    const max = el.scrollWidth - el.clientWidth;
    const index = max <= 0 ? 0 : Math.round((el.scrollLeft / max) * (count - 1));
    setPage((p) => (p.index === index && p.count === count ? p : { index, count }));
  }

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function go(dir: 1 | -1) {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  const atStart = page.index === 0;
  const atEnd = page.index >= page.count - 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-[-0.4px] text-ink md:text-xl">
            Bisa bayar dari
          </h3>
          <p className="text-[13px] text-muted md:text-sm">
            Satu QRIS untuk semua e-wallet dan m-banking, atau pakai saldo.
          </p>
        </div>
        <div className="flex gap-2 max-md:hidden">
          {([
            [-1, "Sebelumnya", ChevronLeft, atStart],
            [1, "Berikutnya", ChevronRight, atEnd],
          ] as const).map(([dir, label, Icon, off]) => (
            <button
              key={label}
              type="button"
              onClick={() => go(dir)}
              disabled={off}
              aria-label={label}
              className="kr-press flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface text-ink shadow-soft transition-opacity disabled:opacity-40"
            >
              <Icon size={18} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <ul
          ref={track}
          onScroll={measure}
          aria-label="Metode pembayaran yang didukung"
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2.5 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {logos.map((l) => (
            <li
              key={l.name}
              className="flex h-16 w-[132px] shrink-0 snap-start items-center justify-center gap-2 rounded-2xl border border-hairline bg-white p-3 shadow-soft md:h-[84px] md:w-[200px] md:rounded-[20px] md:p-4"
            >
              {l.src ? (
                // eslint-disable-next-line @next/next/no-img-element -- logo kecil statis, SVG tidak perlu optimasi
                <img src={l.src} alt={l.name} className="h-6 w-full object-contain md:h-8" />
              ) : (
                <>
                  <Landmark size={20} aria-hidden="true" className="text-[#111113]" />
                  <span className="font-display text-sm font-bold tracking-[-0.3px] text-[#111113] md:text-[17px]">
                    {l.name}
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
        {!atEnd && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent to-card md:w-24"
          />
        )}
      </div>

      {page.count > 1 && (
        <div aria-hidden="true" className="flex items-center gap-1.5 max-md:justify-center">
          {Array.from({ length: page.count }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === page.index ? "w-5 bg-ink" : "w-1.5 bg-line"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
