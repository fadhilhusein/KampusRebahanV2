"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={`w-9 h-9 rounded-full ${className}`} aria-hidden="true" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
      className={`w-9 h-9 rounded-full glass glass-hover flex items-center justify-center cursor-pointer transition-colors ${className}`}
    >
      {isDark ? <Sun size={16} className="text-foreground/70" /> : <Moon size={16} className="text-foreground/70" />}
    </button>
  );
}
