"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientBorder from "@/components/ui/GradientBorder";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/transactions";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email atau password salah.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-[32px] font-semibold text-foreground leading-none tracking-tight mb-2">
              Masuk
            </h1>
            <p className="text-[13px] text-foreground/40">
              Belum punya akun?{" "}
              <Link href="/auth/signup" className="text-foreground/70 hover:text-foreground transition-colors underline underline-offset-2">
                Daftar sekarang
              </Link>
            </p>
          </div>

          <GradientBorder>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[12px] text-foreground/50">Password</label>
                  <Link href="/auth/forgot-password" className="text-[12px] text-foreground/40 hover:text-foreground transition-colors underline underline-offset-2">
                    Lupa password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "Memproses..." : "Masuk"}
              </ButtonPrimary>
            </form>
          </GradientBorder>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignInContent />
    </Suspense>
  );
}
