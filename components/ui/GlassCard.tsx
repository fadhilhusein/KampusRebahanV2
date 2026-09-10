import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  radius?: string;
}

export default function GlassCard({ children, className = "", hover = false, radius = "rounded-[2px]" }: GlassCardProps) {
  return (
    <div
      className={`glass ${radius} ${hover ? "glass-hover transition-all duration-300 cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
