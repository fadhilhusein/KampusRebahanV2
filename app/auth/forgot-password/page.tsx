"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Hash, KeyRound, Mail, Send, ShieldCheck } from "lucide-react";
import {
  AuthCard,
  AuthField,
  AuthNotice,
  AuthPasswordField,
  AuthShell,
  AuthSubmit,
} from "@/components/ui/auth-kit";

const RESEND_COOLDOWN_SECONDS = 60;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timeout = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timeout);
  }, [cooldown]);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setInfo(data.message);
        setStep("reset");
        setCooldown(RESEND_COOLDOWN_SECONDS);
      } else {
        setError(data.message ?? "Gagal mengirim kode.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setError("");
    setInfo("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setInfo(data.message ?? "Kode baru telah dikirim.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/auth/signin?reset=1");
      } else {
        setError(data.message ?? "Gagal mereset password.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const linkClass = "font-semibold text-ink hover:underline focus-visible:underline";
  const footer =
    step === "email" ? (
      <>
        Ingat password?{" "}
        <Link href="/auth/signin" className={linkClass}>
          Masuk
        </Link>
      </>
    ) : (
      <>
        Belum menerima kode?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className={`${linkClass} cursor-pointer tabular-nums disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline`}
        >
          {cooldown > 0 ? `Kirim ulang (${cooldown}s)` : "Kirim ulang"}
        </button>
      </>
    );

  return (
    <AuthShell>
      <AuthCard
        icon={KeyRound}
        title={step === "email" ? "Lupa password" : "Reset password"}
        subtitle={
          step === "email"
            ? "Masukkan email, kode reset dikirim ke inbox kamu."
            : "Masukkan kode 6 digit dan password baru."
        }
        footer={footer}
      >
        {step === "email" ? (
          <form key="email" onSubmit={handleSendCode} className="kr-fade-up flex flex-col gap-[18px]">
            <AuthField
              id="forgot-email"
              label="Email"
              icon={Mail}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
            />

            {error && <AuthNotice tone="error">{error}</AuthNotice>}

            <AuthSubmit loading={loading} loadingText="Mengirim..." icon={Send}>
              Kirim kode
            </AuthSubmit>
          </form>
        ) : (
          <form key="reset" onSubmit={handleResetPassword} className="kr-fade-up flex flex-col gap-[18px]">
            {info && <AuthNotice tone="info">{info}</AuthNotice>}

            <AuthField
              id="forgot-code"
              label="Kode 6 digit"
              icon={Hash}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="tracking-[4px]"
            />

            <AuthPasswordField
              id="forgot-new-password"
              label="Password baru"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
            />

            <AuthPasswordField
              id="forgot-confirm-password"
              label="Konfirmasi password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
            />

            {error && <AuthNotice tone="error">{error}</AuthNotice>}

            <AuthSubmit loading={loading} loadingText="Memproses..." icon={ShieldCheck}>
              Simpan password
            </AuthSubmit>
          </form>
        )}
      </AuthCard>
    </AuthShell>
  );
}
