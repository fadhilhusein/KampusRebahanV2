import { ReactNode } from "react";

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  radius?: string;
}

export default function GradientBorder({ children, className = "", radius = "rounded-[2px]" }: GradientBorderProps) {
  return (
    <div
      className={`relative p-px ${radius} ${className}`}
      style={{
        background: "linear-gradient(152deg, color-mix(in srgb, var(--color-primary) 40%, transparent) 0%, transparent 46%, color-mix(in srgb, var(--color-foreground) 25%, transparent) 100%)",
      }}
    >
      <div className={`relative ${radius} bg-background/80 h-full w-full`}>
        {children}
      </div>
    </div>
  );
}
