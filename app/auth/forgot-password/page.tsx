"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientBorder from "@/components/ui/GradientBorder";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

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

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    const interval = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

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
        startCooldown();
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
      startCooldown();
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
      <main className="flex-1 pt-24 pb-16 px-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-[32px] font-semibold text-foreground leading-none tracking-tight mb-2">
              Lupa Password
            </h1>
            <p className="text-[13px] text-foreground/40">
              Ingat password?{" "}
              <Link href="/auth/signin" className="text-foreground/70 hover:text-foreground transition-colors underline underline-offset-2">
                Masuk
              </Link>
            </p>
          </div>

          <GradientBorder>
            {step === "email" ? (
              <form onSubmit={handleSendCode} className="p-6 space-y-4">
                <div>
                  <label className="block text-[12px] text-foreground/50 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    className="w-full glass rounded-[2px] px-4 py-3 text-[14px] text-foreground placeholder-white/20 border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors bg-transparent"
                  />
                </div>

                {error && (
                  <div className="bg-primary/10 border border-primary/30 rounded-[2px] px-4 py-3 text-[13px] text-primary">
                    {error}
                  </div>
                )}

                <ButtonPrimary type="submit" disabled={loading} className="w-full py-3 text-[14px]">
                  {loading ? "Mengirim..." : "Kirim Kode Reset"}
                </ButtonPrimary>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="p-6 space-y-4">
                {info && (
                  <div className="bg-foreground/5 border border-foreground/10 rounded-[2px] px-4 py-3 text-[13px] text-foreground/60">
                    {info}
                  </div>
                )}

                <div>
                  <label className="block text-[12px] text-foreground/50 mb-2">Kode Reset</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full glass rounded-[2px] px-4 py-3 text-[14px] text-foreground placeholder-white/20 border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors bg-transparent tracking-[4px]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-foreground/50 mb-2">Password Baru</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass rounded-[2px] px-4 py-3 text-[14px] text-foreground placeholder-white/20 border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-foreground/50 mb-2">Konfirmasi Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass rounded-[2px] px-4 py-3 text-[14px] text-foreground placeholder-white/20 border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors bg-transparent"
                  />
                </div>

                {error && (
                  <div className="bg-primary/10 border border-primary/30 rounded-[2px] px-4 py-3 text-[13px] text-primary">
                    {error}
                  </div>
                )}

                <ButtonPrimary type="submit" disabled={loading} className="w-full py-3 text-[14px]">
                  {loading ? "Memproses..." : "Reset Password"}
                </ButtonPrimary>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  className="w-full text-center text-[12px] text-foreground/40 hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  {cooldown > 0 ? `Kirim ulang kode (${cooldown}s)` : "Kirim ulang kode"}
                </button>
              </form>
            )}
          </GradientBorder>
        </div>
      </main>
      <Footer />
    </>
  );
}
