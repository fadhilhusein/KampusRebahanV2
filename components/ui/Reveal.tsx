"use client";
import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

// Sama dengan --kr-ease di globals.css.
export const EASE = [0.22, 1, 0.36, 1] as const;

type Tag = "div" | "section" | "header" | "footer" | "ul" | "ol" | "li" | "p" | "span" | "h1" | "h2";

const item: Variants = {
  hidden: ({ y }: { y: number }) => ({ opacity: 0, y }),
  show: ({ delay }: { delay: number }) => ({
    opacity: 1,
    y: 0,
    // delay eksplisit akan menimpa delay stagger dari induk, jadi hanya dipasang bila >0
    transition: { duration: 0.4, ease: EASE, ...(delay ? { delay } : {}) },
  }),
};

type Props = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /** detik */
  delay?: number;
  /** jarak awal dari bawah (px) */
  y?: number;
  /** >0: anak <RevealItem> muncul bergantian, jeda per anak (detik) */
  stagger?: number;
  /** true: animasi saat mount, bukan saat masuk viewport */
  onMount?: boolean;
};

/** Reveal satu blok saat masuk viewport (sekali). Dengan `stagger`, animasikan anak <RevealItem>. */
export default function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  y = 16,
  stagger = 0,
  onMount = false,
}: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  const variants: Variants = stagger
    ? { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }
    : item;
  return (
    <Tag
      className={className}
      custom={{ y, delay }}
      variants={variants}
      initial={reduce ? false : "hidden"}
      {...(onMount
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, amount: 0.2 } })}
    >
      {children}
    </Tag>
  );
}

/** Anak dari <Reveal stagger>. Tanpa induk Reveal, tidak beranimasi. */
export function RevealItem({
  children,
  className,
  as = "div",
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  y?: number;
}) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag className={className} custom={{ y, delay: 0 }} variants={item}>
      {children}
    </Tag>
  );
}
