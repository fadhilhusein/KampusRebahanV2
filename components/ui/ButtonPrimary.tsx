import { ButtonHTMLAttributes, ReactNode } from "react";
interface ButtonPrimaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
}
export default function ButtonPrimary({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonPrimaryProps) {
  return (
    <button
      type={type}
      className={`kr-button inline-flex items-center justify-center gap-2 min-h-11 px-5 py-3 text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variant === "ghost" ? "border border-foreground/15 bg-surface text-foreground hover:bg-foreground/5" : "bg-btn-fill text-btn-text hover:opacity-90"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
