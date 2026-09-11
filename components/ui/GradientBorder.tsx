import { ReactNode } from "react";

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  radius?: string;
}

// Name kept for backward compat across the codebase; border is now solid, not a gradient.
export default function GradientBorder({ children, className = "", radius = "rounded-[2px]" }: GradientBorderProps) {
  return (
    <div className={`relative border border-foreground/20 bg-background/80 ${radius} ${className}`}>
      {children}
    </div>
  );
}
