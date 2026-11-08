"use client";

import { useState } from "react";
import { estimateRefund, operationalFee, REFUND_SERVICE_FEE_PERCENT } from "@/lib/refundCalc";

const SIM_METHODS = [
  ["QRIS_GATEWAY", "QRIS Bayar.gg"],
  ["QRIS_BRIDGE", "QRIS Instan"],
  ["BALANCE", "Saldo / transfer"],
] as const;

const rupiah = (n: number) => n.toLocaleString("id-ID");

function NumberField({ id, label, value, onChange, min }: { id: string; label: string; value: number | ""; onChange: (v: number | "") => void; min: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-semibold">{label}</label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? "" : Math.max(min, Math.floor(Number(e.target.value))))}
        className="kr-field min-h-12"
      />
    </div>
  );
}

export default function RefundCalculator() {
  const [price, setPrice] = useState<number | "">(20000);
  const [warranty, setWarranty] = useState<number | "">(30);
  const [used, setUsed] = useState(10);
  const [method, setMethod] = useState<string>("QRIS_GATEWAY");

  const warrantyDays = warranty === "" ? 0 : warranty;
  const usedDays = Math.min(used, Math.max(warrantyDays, 0));
  const priceValue = price === "" ? 0 : price;
  const opFee = operationalFee(method, priceValue);
  const result = estimateRefund(priceValue, warrantyDays, usedDays, opFee);
  const usedPct = warrantyDays >= 1 ? (usedDays / warrantyDays) * 100 : 0;

  return (
    <section id="simulasi" aria-labelledby="sim-title" className="kr-fade-up scroll-mt-28 flex flex-col gap-5 rounded-[28px] bg-surface p-5 shadow-card md:p-7" style={{ animationDelay: "80ms" }}>
      <h2 id="sim-title" className="text-xl font-semibold">Simulasi manual</h2>
      <div className="grid grid-cols-2 gap-3">
        <NumberField id="price" label="Harga beli (Rp)" value={price} onChange={setPrice} min={0} />
        <NumberField id="warranty" label="Masa garansi (hari)" value={warranty} onChange={setWarranty} min={1} />
      </div>

      <div className="flex flex-col gap-2">
        <span id="sim-method" className="text-[13px] font-semibold">Dibayar via</span>
        <div role="group" aria-labelledby="sim-method" className="grid grid-cols-3 gap-2">
          {SIM_METHODS.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={method === id} onClick={() => setMethod(id)} className="kr-chip kr-press px-2 text-[13px]">
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="used" className="text-[13px] font-semibold">
          Sudah dipakai: <span className="tabular-nums">{usedDays}</span> hari
        </label>
        <input
          id="used"
          type="range"
          min={0}
          max={Math.max(warrantyDays, 0)}
          step={1}
          value={usedDays}
          disabled={warrantyDays < 1}
          onChange={(e) => setUsed(Number(e.target.value))}
          className="h-11 w-full cursor-pointer accent-[var(--kr-ink)]"
        />
        <div className="flex flex-col gap-1.5">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-success-bg" aria-hidden="true">
            <div className="h-full bg-warn transition-[width]" style={{ width: `${usedPct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted">
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-warn" aria-hidden="true" /> Terpakai</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" aria-hidden="true" /> Sisa garansi</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="rounded-[18px] bg-card px-4 py-3">
          <span className="block text-[13px] text-muted">Sisa garansi</span>
          <span className="block font-display text-xl font-bold tabular-nums">{result ? `${result.remainingDays} hari` : "-"}</span>
        </div>
        <div className="rounded-[18px] bg-card px-4 py-3">
          <span className="block text-[13px] text-muted">Biaya layanan</span>
          <span className="block font-display text-xl font-bold tabular-nums">{REFUND_SERVICE_FEE_PERCENT}%</span>
        </div>
        <div className="col-span-2 rounded-[18px] bg-card px-4 py-3 md:col-span-1">
          <span className="block text-[13px] text-muted">Biaya operasional</span>
          <span className="block font-display text-xl font-bold tabular-nums">Rp{rupiah(opFee)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 rounded-[22px] bg-ink p-5 text-on-ink md:p-6" aria-live="polite">
        <span className="text-sm font-medium text-on-ink-muted">Estimasi refund</span>
        {result ? (
          <>
            <span className="font-display text-4xl font-bold tabular-nums [overflow-wrap:anywhere] md:text-5xl">Rp{rupiah(result.amount)}</span>
            <span className="text-[13px] tabular-nums text-on-ink-muted">
              {rupiah(priceValue)} × {result.remainingDays}/{warrantyDays} × {100 - REFUND_SERVICE_FEE_PERCENT}%
              {opFee > 0 && ` − ${rupiah(opFee)}`}
            </span>
          </>
        ) : (
          <span className="text-sm">Isi harga beli dan masa garansi minimal 1 hari.</span>
        )}
      </div>

      <p className="text-[13px] text-muted">
        Estimasi = harga × (sisa garansi ÷ total garansi), lalu dikurangi biaya layanan. Geser angkanya untuk melihat pengaruhnya. 
Ini hanya simulasi. Angka untuk pesananmu dihitung dari data invoice lewat formulir di atas.
      </p>
    </section>
  );
}
