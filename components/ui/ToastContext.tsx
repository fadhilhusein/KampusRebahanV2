"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

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
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

const typeStyles: Record<ToastType, string> = {
  success: "border-green-500/40 bg-green-500/10 text-green-300",
  error: "border-primary/40 bg-primary/10 text-primary",
  info: "border-foreground/20 bg-foreground/8 text-foreground",
};

const typeIcons: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "i",
};

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 glass backdrop-blur-[12px] shadow-lg transition-all duration-300 ${typeStyles[toast.type]}`}
        >
          <span className="text-[12px] font-mono mt-0.5 w-4 text-center flex-shrink-0">
            {typeIcons[toast.type]}
          </span>
          <p className="text-[13px] leading-5 flex-1">{toast.message}</p>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-[14px] opacity-40 hover:opacity-80 transition-opacity flex-shrink-0 mt-0.5"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
