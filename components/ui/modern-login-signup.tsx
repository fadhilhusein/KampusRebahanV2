"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn, Mail, User, UserPlus } from "lucide-react";
import {
  AuthCard,
  AuthField,
  AuthNotice,
  AuthPasswordField,
  AuthShell,
  AuthSubmit,
} from "@/components/ui/auth-kit";

type AuthMode = "signin" | "signup";

const DEFAULT_CALLBACK = "/dashboard";

// Only same-origin paths are allowed as post-login redirect target.
function safeCallbackUrl(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return DEFAULT_CALLBACK;
  }
  return raw;
}

function SignInSignUpCard({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl");
  const callbackUrl = safeCallbackUrl(rawCallback);
  const isSignIn = mode === "signin";

  let notice = "";
  if (isSignIn && searchParams.get("registered") === "1") notice = "Akun berhasil dibuat. Silakan masuk.";
  if (isSignIn && searchParams.get("reset") === "1") notice = "Password berhasil direset. Silakan masuk.";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keep the post-login destination when hopping between sign-in and sign-up.
  const query = rawCallback ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignIn) {
        const res = await signIn("credentials", { email, password, redirect: false });
        if (res?.error) {
          setError(
            res.code === "rate_limited"
              ? "Terlalu banyak percobaan login. Coba lagi dalam 15 menit."
              : "Email atau password salah."
          );
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (data.success) {
          const params = new URLSearchParams({ registered: "1" });
          if (rawCallback) params.set("callbackUrl", callbackUrl);
          router.push(`/auth/signin?${params.toString()}`);
        } else {
          setError(data.message ?? "Gagal mendaftar.");
        }
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const HeaderIcon = isSignIn ? LogIn : UserPlus;

  const linkClass = "font-semibold text-ink hover:underline focus-visible:underline";

  const footer = (
    <>
      {isSignIn ? "Belum punya akun? " : "Sudah punya akun? "}
      <Link href={isSignIn ? `/auth/signup${query}` : `/auth/signin${query}`} className={linkClass}>
        {isSignIn ? "Daftar" : "Masuk"}
      </Link>
      {isSignIn && (
        <>
          {" · "}
          <Link href="/auth/forgot-password" className={linkClass}>
            Lupa password?
          </Link>
        </>
      )}
    </>
  );

  return (
    <AuthCard
      icon={HeaderIcon}
      title={isSignIn ? "Masuk" : "Daftar"}
      subtitle={isSignIn ? "Masuk untuk melihat pesanan dan saldo." : "Gratis, selesai dalam satu menit."}
      footer={footer}
    >
      {notice && <AuthNotice tone="success">{notice}</AuthNotice>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
        {!isSignIn && (
          <AuthField
            id="auth-name"
            label="Nama"
            icon={User}
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama lengkap"
          />
        )}

        <AuthField
          id="auth-email"
          label="Email"
          icon={Mail}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
        />

        <AuthPasswordField
          id="auth-password"
          label="Password"
          required
          minLength={isSignIn ? undefined : 8}
          autoComplete={isSignIn ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 8 karakter"
        />

        {error && <AuthNotice tone="error">{error}</AuthNotice>}

        <AuthSubmit loading={loading} loadingText="Memproses..." icon={HeaderIcon}>
          {isSignIn ? "Masuk" : "Buat akun"}
        </AuthSubmit>
      </form>
    </AuthCard>
  );
}

interface ModernLoginSignupProps {
  mode?: AuthMode;
}

export default function Component({ mode = "signin" }: ModernLoginSignupProps) {
  return (
    <AuthShell>
      {/* useSearchParams needs a Suspense boundary */}
      <Suspense fallback={<div className="h-[460px] w-full" />}>
        <SignInSignUpCard mode={mode} />
      </Suspense>
    </AuthShell>
  );
}
