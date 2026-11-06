"use client";
import { useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import Navbar from "@/components/layout/Navbar";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: ReactNode;
  icon?: LucideIcon;
  labelExtra?: ReactNode;
  trailing?: ReactNode;
  error?: ReactNode;
}
export function AuthField({
  id,
  label,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  icon: _icon,
  labelExtra,
  trailing,
  error,
  className = "",
  ...props
}: AuthFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-semibold text-ink">
          {label}
        </label>
        {labelExtra}
      </div>
      <div className="relative">
        <input
          {...props}
          id={id}
          className={`kr-field ${trailing ? "pr-12" : ""} ${className}`}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={error ? errorId : props["aria-describedby"]}
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} className="kr-fade-in mt-2 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
type AuthPasswordFieldProps = Omit<
  AuthFieldProps,
  "icon" | "trailing" | "type"
>;
export function AuthPasswordField(props: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <AuthField
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:text-ink"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  );
}
const noticeStyles = {
  error: {
    box: "bg-danger-bg text-danger",
    icon: AlertCircle,
    role: "alert",
  },
  success: {
    box: "bg-success-bg text-success",
    icon: CheckCircle2,
    role: "status",
  },
  info: {
    box: "bg-pill text-muted",
    icon: Info,
    role: "status",
  },
} as const;
export function AuthNotice({
  tone,
  children,
}: {
  tone: keyof typeof noticeStyles;
  children: ReactNode;
}) {
  const { box, icon: Icon, role } = noticeStyles[tone];
  return (
    <div
      role={role}
      className={`kr-fade-in flex items-start gap-2 rounded-2xl p-4 text-[13px] font-medium ${box}`}
    >
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
export function AuthSubmit({
  loading,
  loadingText,
  icon: Icon,
  children,
}: {
  loading: boolean;
  loadingText: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <ButtonPrimary type="submit" disabled={loading} className="w-full">
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Icon size={16} />
      )}{" "}
      {loading ? loadingText : children}
    </ButtonPrimary>
  );
}
export function AuthCard({
  title,
  subtitle,
  footer,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle: ReactNode;
  /** teks/link di bawah kartu */
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* key: animasi diputar ulang saat judul berganti (langkah lupa password) */}
      <div key={title} className="kr-fade-up flex flex-col items-center gap-2.5 text-center">
        <h1 className="text-4xl font-bold tracking-[-1.5px] md:text-[64px] md:leading-[1.05] md:tracking-[-3px]">
          {title}
        </h1>
        <p className="max-w-[420px] text-base text-muted">{subtitle}</p>
      </div>
      <div
        className="kr-fade-up flex w-full max-w-[420px] flex-col gap-[18px] rounded-[28px] bg-surface p-5 shadow-card md:rounded-[32px] md:p-8"
        style={{ animationDelay: "80ms" }}
      >
        {children}
      </div>
      {footer && (
        <div className="kr-fade-up text-center text-sm text-muted" style={{ animationDelay: "160ms" }}>
          {footer}
        </div>
      )}
    </div>
  );
}
/** Kerangka halaman auth: navbar di dalam kontainer halaman, konten di tengah vertikal, tanpa footer (SPEC 3.9). */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="kr-page min-h-0 flex-1">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center py-10 md:py-12">
        {children}
      </main>
    </div>
  );
}
