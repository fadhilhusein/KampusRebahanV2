import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "md" | "sm";

const variants: Record<Exclude<Variant, "ghost">, string> = {
  primary: "bg-ink text-on-ink hover:bg-ink-hover",
  secondary: "bg-pill text-ink hover:bg-pill-hover",
  danger: "bg-danger-bg text-danger hover:bg-danger-bg-hover",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  const v = variants[variant === "ghost" ? "secondary" : variant];
  const s = size === "sm" ? "px-4 py-2 text-[13px]" : "min-h-11 px-[26px] py-3.5 text-sm";
  return `kr-press inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${s} ${v}`;
}

interface ButtonPrimaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

export default function ButtonPrimary({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonPrimaryProps) {
  return (
    <button type={type} className={`${buttonClass(variant, size)} ${className}`} {...props}>
      {children}
    </button>
  );
}
