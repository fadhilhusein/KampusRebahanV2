"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Check, Copy, Gift, Loader2, Mail, Ticket } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { EASE } from "@/components/ui/Reveal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import type { LoyaltyState } from "@/lib/loyalty";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

type LoyaltyResult = { state: LoyaltyState } | { error: string };

async function fetchLoyalty(): Promise<LoyaltyResult> {
  try {
    const res = await fetch("/api/loyalty");
    const data = await res.json();
    return data.success ? { state: data.data } : { error: data.message ?? "Gagal memuat progres hadiah." };
  } catch {
    return { error: "Terjadi kesalahan saat memuat progres hadiah." };
  }
}

// Full-width loyalty card for the dashboard overview: progress towards the reward, then the coupon
// and its redeem form once the threshold is reached.
export default function LoyaltyCard() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const reduce = useReducedMotion();

  const [state, setState] = useState<LoyaltyState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [redeemOpen, setRedeemOpen] = useState(false);
  const [emailInvite, setEmailInvite] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState("");
  const [copied, setCopied] = useState(false);

  const applyResult = useCallback((result: LoyaltyResult) => {
    if ("state" in result) {
      setState(result.state);
      setLoadError("");
    } else {
      setLoadError(result.error);
    }
    setLoading(false);
  }, []);

  const reload = useCallback(async () => applyResult(await fetchLoyalty()), [applyResult]);

  useEffect(() => {
    let cancelled = false;
    fetchLoyalty().then((result) => {
      if (!cancelled) applyResult(result);
    });
    return () => {
      cancelled = true;
    };
  }, [applyResult]);

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      addToast("Gagal menyalin kode kupon.", "error");
    }
  }

  function openRedeem() {
    setRedeemError("");
    setEmailInvite((current) => current || session?.user?.email || "");
    setRedeemOpen(true);
  }

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    setRedeeming(true);
    setRedeemError("");

    try {
      const res = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailInvite }),
      });
      const data = await res.json();

      if (data.success) {
        addToast(data.data.message, "success");
        setRedeemOpen(false);
        await reload();
      } else {
        const msg = data.message ?? "Gagal menukar kupon.";
        setRedeemError(msg);
        addToast(msg, "error");
      }
    } catch {
      const msg = "Terjadi kesalahan. Coba lagi.";
      setRedeemError(msg);
      addToast(msg, "error");
    } finally {
      setRedeeming(false);
    }
  }

  const coupon = state?.coupon ?? null;
  const unlocked = coupon?.status === "ACTIVE";
  const redeemed = coupon?.status === "REDEEMED";

  return (
    <section
      aria-label="Hadiah loyalitas"
      className="relative rounded-[28px] bg-surface p-5 shadow-card md:p-7"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pill text-ink">
          <Gift size={26} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="kr-shimmer h-6 w-48" radius="rounded-lg" />
              <Skeleton className="kr-shimmer h-4 w-72 max-w-full" radius="rounded-lg" />
              <Skeleton className="kr-shimmer mt-4 h-3 w-full" radius="rounded-full" />
            </div>
          ) : !state ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-muted">{loadError}</p>
              <ButtonPrimary
                variant="secondary"
                size="sm"
                className="kr-press"
                onClick={() => {
                  setLoading(true);
                  reload();
                }}
              >
                Coba lagi
              </ButtonPrimary>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-semibold leading-tight text-ink">Program loyalitas</h2>
                {unlocked && (
                  <span className="kr-fade-in rounded-full bg-success-bg px-2.5 py-0.5 text-xs font-semibold text-success">
                    Kupon siap ditukar
                  </span>
                )}
                {redeemed && (
                  <span className="rounded-full bg-pill px-2.5 py-0.5 text-xs font-semibold text-muted">
                    Sudah ditukar
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">
                Total belanja {formatPrice(state.threshold)} dan dapatkan{" "}
                <span className="font-semibold text-ink">{state.rewardLabel}</span> gratis.
              </p>

              <div className="mt-4">
                <div className="mb-2 flex items-baseline justify-between gap-3 text-xs font-semibold">
                  <span className="text-ink">
                    {formatPrice(Math.min(state.total, state.threshold))}
                    <span className="text-muted"> / {formatPrice(state.threshold)}</span>
                  </span>
                  <span className="text-muted">{state.percent}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Progres hadiah loyalitas"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={state.percent}
                  className="h-3 overflow-hidden rounded-full bg-pill"
                >
                  <motion.div
                    className="h-full rounded-full bg-ink"
                    initial={reduce ? false : { width: 0 }}
                    animate={{ width: `${state.percent}%` }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-muted">
                  {coupon ? "Target tercapai." : `Kurang ${formatPrice(state.remaining)} lagi untuk membuka kupon.`}
                </p>
              </div>

              {coupon && (
                <div className="mt-5 border-t border-hairline pt-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5 rounded-2xl border border-dashed border-line px-3.5 py-2">
                      <Ticket size={16} aria-hidden="true" className="text-ink" />
                      <span className="font-mono text-sm font-bold tracking-wider text-ink">{coupon.code}</span>
                      <button
                        type="button"
                        onClick={() => copyCode(coupon.code)}
                        aria-label="Salin kode kupon"
                        className="kr-press flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted hover:text-ink"
                      >
                        {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
                      </button>
                    </div>

                    {unlocked && !redeemOpen && (
                      <ButtonPrimary type="button" variant="secondary" onClick={openRedeem} className="kr-press">
                        <Gift size={15} />
                        Tukar Kupon
                      </ButtonPrimary>
                    )}

                    {redeemed && coupon.orderId && (
                      <Link
                        href={`/dashboard/transactions/${coupon.orderId}`}
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink underline underline-offset-2"
                      >
                        Lihat pesanan hadiah
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>

                  {unlocked && redeemOpen && (
                    <form onSubmit={handleRedeem} className="kr-fade-up mt-4 max-w-md space-y-3">
                      <div>
                        <label htmlFor="loyalty-email" className="mb-2 block text-[13px] font-semibold text-ink">
                          Email untuk undangan {state.rewardLabel}
                        </label>
                        <div className="relative">
                          <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                          <input
                            id="loyalty-email"
                            type="email"
                            required
                            value={emailInvite}
                            onChange={(e) => setEmailInvite(e.target.value)}
                            placeholder="email-google@contoh.com"
                            className="kr-field !pl-10"
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-muted">Pastikan email ini benar, undangan akan dikirim ke sini.</p>
                      </div>

                      {redeemError && (
                        <div role="alert" className="rounded-2xl bg-danger-bg px-4 py-2.5 text-[13px] font-medium text-danger">
                          {redeemError}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <ButtonPrimary type="submit" disabled={redeeming} className="kr-press">
                          {redeeming ? <Loader2 size={15} className="animate-spin" /> : <Gift size={15} />}
                          {redeeming ? "Memproses..." : "Konfirmasi Tukar"}
                        </ButtonPrimary>
                        <ButtonPrimary type="button" variant="secondary" onClick={() => setRedeemOpen(false)} disabled={redeeming} className="kr-press">
                          Batal
                        </ButtonPrimary>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
