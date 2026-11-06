"use client";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { EASE } from "@/components/ui/Reveal";
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  if (!mounted)
    return (
      <span className={`block h-11 w-11 ${className}`} aria-hidden="true" />
    );
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
      className={`kr-press relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-hairline bg-surface text-ink shadow-soft hover:bg-pill ${className}`}
    >
      {/* reducedMotion="user": hanya cross-fade, tanpa putar/skala */}
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={dark ? "sun" : "moon"}
            className="flex"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.span>
        </AnimatePresence>
      </MotionConfig>
    </button>
  );
}
