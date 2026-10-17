"use client";
import { useState } from "react";
import Image from "next/image";
import type { InputHTMLAttributes, ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import Footer from "@/components/layout/Footer";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: ReactNode;
  icon: LucideIcon;
  labelExtra?: ReactNode;
  trailing?: ReactNode;
}
export function AuthField({
  id,
  label,
  icon: Icon,
  labelExtra,
  trailing,
  className = "",
  ...props
}: AuthFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium">
          {label}
        </label>
        {labelExtra}
      </div>
      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
        />
        <input
          id={id}
          className={`w-full rounded-md border border-foreground/20 bg-surface py-3 pl-11 pr-11 text-[14px] min-h-[50px] ${className}`}
          {...props}
        />
        {trailing}
      </div>
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
      icon={Lock}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-foreground/50"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      }
    />
  );
}
const noticeStyles = {
  error: {
    box: "border-primary/30 bg-primary/5 text-primary",
    icon: AlertCircle,
    role: "alert",
  },
  success: {
    box: "kr-notice-success",
    icon: CheckCircle2,
    role: "status",
  },
  info: {
    box: "border-foreground/15 bg-foreground/5 text-foreground/70",
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
      className={`flex items-start gap-2 rounded-md border p-4 text-[13px] ${box}`}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
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
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="kr-auth-card">
      <div className="mb-8">
        <p className="kr-eyebrow mb-4">KampusRebahan</p>
        <h1 className="text-[34px] leading-tight tracking-tight font-medium mb-4">
          {title}
        </h1>
        <p className="kr-muted text-sm leading-6">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="kr-auth-shell">
        <aside className="kr-auth-visual">
          <p className="kr-eyebrow">Akses sesuai kebutuhanmu</p>
          <h2>
            Satu akun.
            <br />
            Banyak kemungkinan.
          </h2>
          <p className="kr-muted text-sm">
            Hiburan, kreativitas, dan produktivitas
            <br />
            dalam satu tempat.
          </p>
          <Image
            src="/landing/access-final.png"
            alt="Kartu akses digital KampusRebahan"
            width={530}
            height={400}
          />
        </aside>
        {children}
      </main>
      <Footer />
    </>
  );
}
