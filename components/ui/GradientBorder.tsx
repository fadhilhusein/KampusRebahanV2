import { ReactNode } from "react";

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  radius?: string;
}

// Name kept for backward compat across the codebase; border is now solid, not a gradient.
export default function GradientBorder({ children, className = "", radius = "rounded-lg" }: GradientBorderProps) {
  return (
    <div className={`relative border border-foreground/15 bg-surface ${radius} ${className}`}>
      {children}
    </div>
  );
}
