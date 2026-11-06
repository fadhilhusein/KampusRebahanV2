"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { EASE } from "@/components/ui/Reveal";
export type ToastType = "success" | "error" | "info";
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}
const ToastContext = createContext<ToastContextValue | null>(null);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  }, []);
  const removeToast = useCallback(
    (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-20 z-[100] flex flex-col items-center gap-3 md:inset-x-auto md:right-6 md:bottom-auto md:top-20 md:items-end"
      >
        {/* reducedMotion="user": tanpa geser/skala/layout, tinggal fade */}
        <MotionConfig reducedMotion="user">
        <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map((t) => {
          const Icon = {
            success: CheckCircle2,
            error: AlertCircle,
            info: Info,
          }[t.type];
          const iconColor = {
            success: "text-toast-icon",
            error: "text-[#FF8A75]",
            info: "text-on-ink-muted",
          }[t.type];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2, ease: EASE } }}
              transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
              role={t.type === "error" ? "alert" : "status"}
              className="pointer-events-auto flex w-full max-w-[340px] items-center gap-3 rounded-[20px] bg-ink px-[18px] py-3.5 text-on-ink shadow-card"
            >
              <Icon size={20} className={`shrink-0 ${iconColor}`} />
              <p className="flex-1 text-sm font-medium">{t.message}</p>
              <button
                aria-label="Tutup"
                onClick={() => removeToast(t.id)}
                className="kr-press -my-2 -mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
        </AnimatePresence>
        </MotionConfig>
      </div>
    </ToastContext.Provider>
  );
}
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
