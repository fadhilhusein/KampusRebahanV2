"use client";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import ProductCard from "@/components/product/ProductCard";
import ProductImage from "@/components/product/ProductImage";
import { EASE } from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

// Kanvas desain 1200x400; posisi dalam persen agar skala mengikuti lebar kontainer (tidak terpotong).
const W = 1200,
  H = 400,
  CARD = 210;

function Bubble({ name, className, delay }: { name: string; className: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      initial={reduce ? false : { opacity: 0, scale: 0.6, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay }}
      className={`absolute z-20 origin-bottom-left whitespace-nowrap rounded-[18px_18px_18px_4px] bg-accent px-3 py-2 text-[13px] font-semibold text-white md:px-4 md:py-2.5 md:text-[15px] ${className}`}
    >
      {name}
    </motion.span>
  );
}

function Card({
  i,
  d,
  rotate,
  px,
  py,
  children,
  style,
  className,
}: {
  i: number;
  d: number;
  rotate: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
  children: ReactNode;
  style: CSSProperties;
  className: string;
}) {
  const reduce = useReducedMotion();
  // kartu di tengah bergeser lebih jauh: kesan kedalaman
  const depth = 1.4 - d * 0.25;
  const x = useTransform(px, (v) => v * 14 * depth);
  const y = useTransform(py, (v) => v * 10 * depth);
  return (
    <motion.div className={`absolute ${className}`} style={{ ...style, x, y }}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 90, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate }}
        whileHover={reduce ? undefined : { y: -16, rotate: 0, scale: 1.05 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.15 + i * 0.07 }}
      >
        <div className="kr-float" style={{ animationDelay: `${-i * 0.85}s`, animationDuration: `${5.5 + (i % 3) * 0.6}s` }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroGallery({ products }: { products: Product[] }) {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0),
    rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 80, damping: 20 }),
    py = useSpring(rawY, { stiffness: 80, damping: 20 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const desktop = products.slice(0, 7);
  const mobile = products.slice(0, 4);
  const dc = (desktop.length - 1) / 2;
  const mc = (mobile.length - 1) / 2;
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <>
      <div
        aria-hidden="true"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative mt-2 hidden aspect-[1200/400] w-full md:block"
      >
        <Bubble name="@netflix" className="left-[1%] top-[5%]" delay={0.7} />
        <Bubble name="@spotify" className="right-[1%] top-[17%]" delay={0.85} />
        {desktop.map((p, i) => {
          const d = Math.abs(dc - i);
          return (
            <Card
              key={p.id}
              i={i}
              d={d}
              rotate={-((dc - i) * 3)}
              px={px}
              py={py}
              className="hover:z-30!"
              style={{
                width: pct(CARD, W),
                left: pct(W / 2 - CARD / 2 - dc * 150 + i * 150, W),
                top: pct(60 + d * 22, H),
                zIndex: Math.round(10 - d),
              }}
            >
              <ProductCard product={p} variant="gallery" />
            </Card>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className="relative mx-auto mt-4 h-[196px] w-[326px] max-w-full md:hidden"
      >
        <Bubble name="@netflix" className="left-0 top-0" delay={0.6} />
        {mobile.map((p, i) => {
          const d = Math.abs(mc - i);
          return (
            <Card
              key={p.id}
              i={i}
              d={d}
              rotate={-((mc - i) * 5)}
              px={px}
              py={py}
              className=""
              style={{ left: 6 + i * 70, top: 36 + d * 12, zIndex: Math.round(10 - d) }}
            >
              <div className="h-[136px] w-[110px] rounded-[20px] bg-surface p-1.5 shadow-card">
                <div className="relative h-full w-full overflow-hidden rounded-[14px]">
                  <ProductImage name={p.name} category={p.category} sizes="110px" iconSize={36} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
