import { ReactNode } from "react";

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  radius?: string;
}

// Nama dipertahankan agar import di halaman tidak berubah; isinya kartu surface biasa.
export default function GradientBorder({ children, className = "", radius = "rounded-[28px]" }: GradientBorderProps) {
  return (
    <div className={`relative bg-surface shadow-card ${radius} ${className}`}>
      {children}
    </div>
  );
}
