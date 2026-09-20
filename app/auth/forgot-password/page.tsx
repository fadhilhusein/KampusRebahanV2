"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Hash, KeyRound, Mail, RotateCw, Send, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
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

  return (
    <>
      <Navbar />
      <AuthShell>
        <AuthCard
          icon={KeyRound}
          title={step === "email" ? "Lupa Password" : "Reset Password"}
          subtitle={
            step === "email"
              ? "Masukkan email akun kamu, kami kirim kode reset."
              : "Masukkan kode dari email dan buat password baru."
          }
        >
          {step === "email" ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <AuthField
                id="forgot-email"
                label="Email"
                icon={Mail}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
              />

              {error && <AuthNotice tone="error">{error}</AuthNotice>}

              <AuthSubmit loading={loading} loadingText="Mengirim..." icon={Send}>
                Kirim Kode Reset
              </AuthSubmit>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {info && <AuthNotice tone="info">{info}</AuthNotice>}

              <AuthField
                id="forgot-code"
                label="Kode Reset"
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
                label="Password Baru"
                required
                minLength={8}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
              />

              <AuthPasswordField
                id="forgot-confirm-password"
                label="Konfirmasi Password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
              />

              {error && <AuthNotice tone="error">{error}</AuthNotice>}

              <AuthSubmit loading={loading} loadingText="Memproses..." icon={ShieldCheck}>
                Reset Password
              </AuthSubmit>

              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0}
                className="flex w-full cursor-pointer items-center justify-center gap-1.5 text-[12px] font-medium text-foreground/50 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCw size={13} />
                {cooldown > 0 ? `Kirim ulang kode (${cooldown}s)` : "Kirim ulang kode"}
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-[13px] text-foreground/50">
            Ingat password?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-foreground underline underline-offset-2 transition-colors hover:text-primary"
            >
              Masuk
            </Link>
          </p>
        </AuthCard>
      </AuthShell>
    </>
  );
}
