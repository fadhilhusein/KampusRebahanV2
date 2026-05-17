import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = "", hover = false }: GlassCardProps) {
  return (
    <div
      className={`glass rounded-[2px] ${hover ? "glass-hover transition-all duration-300 cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
