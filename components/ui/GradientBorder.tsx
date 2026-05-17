import { ReactNode } from "react";

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
}

export default function GradientBorder({ children, className = "" }: GradientBorderProps) {
  return (
    <div
      className={`relative p-px rounded-[2px] ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.08) 100%)",
      }}
    >
      <div className="relative rounded-[2px] bg-black/80 h-full w-full">
        {children}
      </div>
    </div>
  );
}
