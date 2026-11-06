import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  radius?: string;
}

export default function GlassCard({ children, className = "", hover = false, radius = "rounded-[28px]" }: GlassCardProps) {
  return (
    <div
      className={`bg-surface shadow-card ${radius} ${hover ? "kr-lift hover:shadow-card-hover" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
