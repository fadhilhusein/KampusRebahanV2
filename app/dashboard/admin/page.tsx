"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ChevronDown, Gift, Landmark, QrCode, RotateCw, Wallet, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Reveal, { RevealItem, EASE } from "@/components/ui/Reveal";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const cardClass = "rounded-[22px] bg-surface shadow-card";

const statusColor: Record<string, "primary" | "secondary" | "tertiary" | "default"> = {
  PENDING_PAYMENT: "tertiary",
  PAID: "secondary",
  PROCESSING: "tertiary",
  AWAITING_RETRY: "primary",
  COMPLETED: "secondary",
  FAILED: "primary",
  REJECTED: "primary",
  EXPIRED: "primary",
};

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "Pending",
  PAID: "Paid",
  PROCESSING: "Processing",
  AWAITING_RETRY: "Perlu Retry",
  COMPLETED: "Completed",
  FAILED: "Failed",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};

const paymentMethodInfo: Record<string, { label: string; icon: LucideIcon }> = {
  QRIS_GATEWAY: { label: "QRIS (Bayar.gg)", icon: Zap },
  QRIS_BRIDGE: { label: "QRIS (Bridge)", icon: Zap },
  QRIS: { label: "QRIS (manual)", icon: QrCode },
  BANK_TRANSFER: { label: "Transfer Bank", icon: Landmark },
  BALANCE: { label: "Saldo", icon: Wallet },
  COUPON: { label: "Kupon Loyalitas", icon: Gift },
};

interface AdminOrder {
  id: string;
  productName: string;
  variantName: string;
  sellPrice: number;
  costPrice: number;
  uniqueCode: number;
  quantity: number;
  status: string;
  paymentRef: string | null;
  paymentNote: string | null;
  paymentMethod: string;
  apiOrderId: string | null;
  apiResponse: unknown;
  gatewayInvoiceId: string | null;
  gatewayStatus: string | null;
  bridgeRef: string | null;
  bridgeStatus: string | null;
  createdAt: string;
  user: { email: string; name: string | null };
}

interface OrderCardProps {
  order: AdminOrder;
  isLoading: boolean;
  onConfirm: (id: string) => void;
  onReject: (id: string, refundEligible: boolean) => void;
  onRecheckGateway: (id: string) => void;
  onRecheckBridge: (id: string) => void;
}

const REFUND_ELIGIBLE_STATUSES = ["PAID", "PROCESSING", "AWAITING_RETRY", "COMPLETED"];

const recheckBtn = buttonClass("secondary", "sm");
const fieldClass = "rounded-xl bg-card px-4 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink";

function OrderDetails({ order }: { order: AdminOrder }) {
  const method = paymentMethodInfo[order.paymentMethod];
  const MethodIcon = method?.icon;
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-[13px] sm:grid-cols-2">
      <div className="text-muted">Jumlah: <span className="font-medium text-ink">{order.quantity}x</span></div>
      <div className="text-muted">Harga Jual: <span className="font-medium text-ink">{formatPrice(order.sellPrice)}</span></div>
      <div className="text-muted">Cost: <span className="text-ink">{formatPrice(order.costPrice)}</span></div>
      <div className="text-muted">Profit: <span className="font-medium text-success">{formatPrice(order.sellPrice - order.costPrice)}</span></div>
      <div className="flex items-center gap-1.5 text-muted">
        Metode:
        <span className="inline-flex items-center gap-1 font-medium text-ink">
          {MethodIcon && <MethodIcon size={12} aria-hidden="true" />}
          {method?.label ?? order.paymentMethod}
        </span>
      </div>
      <div className="truncate font-mono sm:col-span-2 text-xs text-muted">{order.id}</div>
      {order.uniqueCode > 0 && (
        <div className="sm:col-span-2 text-muted">
          Nominal Transfer: <span className="font-semibold text-warn">{formatPrice(order.sellPrice + order.uniqueCode)}</span>
          <span className="ml-1">(kode: +{order.uniqueCode})</span>
        </div>
      )}
      {order.paymentRef && (
        <div className="sm:col-span-2 text-muted">Ref: <span className="font-mono text-ink">{order.paymentRef}</span></div>
      )}
      {order.apiOrderId && (
        <div className="sm:col-span-2 text-muted">API ID: <span className="font-mono text-xs text-ink">{order.apiOrderId}</span></div>
      )}
      {order.gatewayInvoiceId && (
        <div className="sm:col-span-2 text-muted">
          Invoice Bayar.gg: <span className="font-mono text-xs text-ink">{order.gatewayInvoiceId}</span>
          {order.gatewayStatus && <span className="ml-1">({order.gatewayStatus})</span>}
        </div>
      )}
      {order.bridgeRef && (
        <div className="sm:col-span-2 text-muted">
          Ref Bridge: <span className="font-mono text-xs text-ink">{order.bridgeRef}</span>
          {order.bridgeStatus && <span className="ml-1">({order.bridgeStatus})</span>}
        </div>
      )}
      {order.status === "AWAITING_RETRY" && order.apiResponse != null && (
        <div className="sm:col-span-2 text-danger">
          Alasan gagal: <span className="font-mono text-xs">
            {(() => {
              if (typeof order.apiResponse !== "object" || order.apiResponse === null) {
                return String(order.apiResponse);
              }
              const obj = order.apiResponse as Record<string, unknown>;
              const reason = obj.error ?? obj.message;
              return typeof reason === "string" ? reason : JSON.stringify(order.apiResponse);
            })()}
          </span>
        </div>
      )}
    </div>
  );
}

// Pengganti <details>: tinggi panel dianimasikan (0 -> auto), chevron berputar.
function Rincian({ order }: { order: AdminOrder }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="kr-press -my-2 inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
      >
        Rincian
        <ChevronDown size={14} aria-hidden="true" className={`transition-transform duration-(--kr-dur) ease-(--kr-ease) ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="rincian"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
          >
            <div className="pt-3"><OrderDetails order={order} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  // key: badge di-mount ulang saat status berubah, jadi fade masuk lagi
  return (
    <Badge key={status} color={statusColor[status] ?? "default"} className="kr-fade-in shrink-0">
      {statusLabel[status] ?? status}
    </Badge>
  );
}

function OrderActions({
  order,
  isLoading,
  onConfirm,
  onReject,
  onRecheckGateway,
  onRecheckBridge,
  grow,
}: OrderCardProps & { grow?: boolean }) {
  const g = grow ? " flex-1" : "";
  const rejectButton = (
    <button
      onClick={() => onReject(order.id, REFUND_ELIGIBLE_STATUSES.includes(order.status))}
      disabled={isLoading}
      className={`${buttonClass("danger", "sm")}${g}`}
    >
      Tolak
    </button>
  );

  if (order.status === "AWAITING_RETRY") {
    return (
      <>
        <button onClick={() => onConfirm(order.id)} disabled={isLoading} className={`${buttonClass("primary", "sm")}${g}`}>
          <RotateCw size={13} aria-hidden="true" />
          {isLoading ? "..." : "Retry Fulfillment"}
        </button>
        {rejectButton}
      </>
    );
  }
  if (order.status === "PENDING_PAYMENT" || order.status === "PAID") {
    if (order.paymentMethod === "QRIS_GATEWAY") {
      return (
        <button onClick={() => onRecheckGateway(order.id)} disabled={isLoading} className={`${recheckBtn}${g}`}>
          <RotateCw size={13} aria-hidden="true" />
          {isLoading ? "..." : "Cek status Bayar.gg"}
        </button>
      );
    }
    if (order.paymentMethod === "QRIS_BRIDGE") {
      return (
        <button onClick={() => onRecheckBridge(order.id)} disabled={isLoading} className={`${recheckBtn}${g}`}>
          <RotateCw size={13} aria-hidden="true" />
          {isLoading ? "..." : "Cek status Bridge"}
        </button>
      );
    }
    return (
      <>
        <button onClick={() => onConfirm(order.id)} disabled={isLoading} className={`${buttonClass("primary", "sm")}${g}`}>
          {isLoading ? "..." : "Konfirmasi"}
        </button>
        {rejectButton}
      </>
    );
  }
  return <span className="text-[13px] text-muted">Tidak ada aksi</span>;
}

const OrderRow = memo(function OrderRow({ index, ...props }: OrderCardProps & { index: number }) {
  const { order } = props;
  const anim = { animationDelay: `${Math.min(index, 10) * 40}ms` };
  return (
    <>
      <tr className="kr-fade-up border-t border-hairline align-top" style={anim}>
        <td className="px-4 py-3">
          <div className="max-w-[260px] truncate text-sm font-semibold">{order.user.name ?? order.user.email}</div>
          <div className="max-w-[260px] truncate text-[13px] text-muted">{order.productName} — {order.variantName}</div>
          <div className="text-xs text-muted">{formatDate(order.createdAt)}</div>
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold">{formatPrice(order.sellPrice)}</td>
        <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
        <td className="px-4 py-3"><div className="flex flex-wrap items-center gap-2"><OrderActions {...props} /></div></td>
      </tr>
      <tr className="kr-fade-up" style={anim}>
        <td colSpan={4} className="px-4 pb-3">
          <Rincian order={order} />
        </td>
      </tr>
    </>
  );
});

const OrderCard = memo(function OrderCard(props: OrderCardProps) {
  const { order } = props;
  return (
    <div className="flex flex-col gap-3 rounded-[22px] bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{order.productName} · {formatPrice(order.sellPrice)}</div>
          <div className="truncate text-[13px] text-muted">{order.user.name ?? order.user.email}</div>
          <div className="text-xs text-muted">{formatDate(order.createdAt)}</div>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="flex gap-2"><OrderActions {...props} grow /></div>
      <Rincian order={order} />
    </div>
  );
});

interface StatProps {
  label: string;
  /** label pendek untuk kartu mini di mobile */
  short?: string;
  value: string;
  dark?: boolean;
  loading: boolean;
}

// Mobile s.d. lg: kartu gelap selebar penuh + 3 kartu mini sejajar. xl: 4 sejajar.
function Stat({ label, short, value, dark, loading }: StatProps) {
  const box = dark
    ? "col-span-3 rounded-[28px] bg-ink p-6 text-on-ink xl:col-span-1"
    : "rounded-[20px] bg-surface p-3.5 md:rounded-[28px] md:p-6";
  return (
    <RevealItem className={`flex min-w-0 flex-col gap-1.5 shadow-card ${box}`}>
      <span className={`text-xs font-medium md:text-sm ${dark ? "text-on-ink-muted" : "text-muted"}`}>
        {short ? <><span className="md:hidden">{short}</span><span className="max-md:hidden">{label}</span></> : label}
      </span>
      {loading ? (
        <Skeleton className="h-8 w-24" radius="rounded-lg" />
      ) : (
        <div
          key={value}
          className={`kr-fade-in font-display font-bold tabular-nums tracking-[-1.5px] break-words ${dark ? "text-[30px] md:text-[36px]" : "text-[24px] md:text-[36px]"}`}
        >
          {value}
        </div>
      )}
    </RevealItem>
  );
}

interface ToggleRowProps {
  title: string;
  description: string;
  enabled: boolean;
  loading: boolean;
  onToggle: () => void;
}

function ToggleRow({ title, description, enabled, loading, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-center gap-4 border-t border-hairline pt-4">
      <div className="flex-1">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-[13px] text-muted">{description}</div>
      </div>
      <button
        onClick={onToggle}
        disabled={loading}
        aria-pressed={enabled}
        className={`${buttonClass(enabled ? "primary" : "secondary", "sm")} flex-shrink-0`}
      >
        {loading ? "..." : enabled ? "Aktif" : "Nonaktif"}
      </button>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [markup, setMarkup] = useState<number | "">("");
  const [markupLoading, setMarkupLoading] = useState(false);
  const [markupMsg, setMarkupMsg] = useState("");
  const [bankTransferEnabled, setBankTransferEnabledState] = useState(true);
  const [bankToggleLoading, setBankToggleLoading] = useState(false);
  const [qrisGatewayEnabled, setQrisGatewayEnabledState] = useState(true);
  const [qrisGatewayToggleLoading, setQrisGatewayToggleLoading] = useState(false);
  const [qrisBridgeEnabled, setQrisBridgeEnabledState] = useState(true);
  const [qrisBridgeToggleLoading, setQrisBridgeToggleLoading] = useState(false);

  // Refreshes only the one order that changed, keeping every other order's
  // object reference stable so memoized OrderCard rows skip re-rendering.
  const refreshOneOrder = useCallback(async (orderId: string) => {
    const res = await fetch(`/api/order/${orderId}`);
    const data = await res.json();
    if (data.success) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data.data : o)));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadInitialOrders() {
      const res = await fetch("/api/admin/orders");
      if (cancelled) return;
      if (res.status === 403 || res.status === 401) {
        router.replace("/dashboard");
        return;
      }
      const data = await res.json();
      if (cancelled) return;
      if (data.success) {
        setOrders(data.data);
      } else setError(data.message ?? "Forbidden");
      setLoading(false);
    }

    loadInitialOrders();
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d.success) return;
        setMarkup(d.data.markup_percent);
        setBankTransferEnabledState(d.data.bank_transfer_enabled);
        setQrisGatewayEnabledState(d.data.qris_gateway_enabled);
        setQrisBridgeEnabledState(d.data.qris_bridge_enabled);
      });

    return () => { cancelled = true; };
  }, [router]);

  async function saveMarkup(e: React.FormEvent) {
    e.preventDefault();
    setMarkupLoading(true);
    setMarkupMsg("");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markup_percent: Number(markup) }),
    });
    const data = await res.json();
    setMarkupMsg(data.message ?? (data.success ? "Tersimpan" : "Gagal"));
    setMarkupLoading(false);
  }

  async function toggleSetting(
    key: string,
    nextValue: boolean,
    setValue: (v: boolean) => void,
    setLoading: (v: boolean) => void
  ) {
    setLoading(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: nextValue }),
    });
    const data = await res.json();
    if (data.success) setValue(nextValue);
    setLoading(false);
  }

  const toggleBankTransfer = () =>
    toggleSetting("bank_transfer_enabled", !bankTransferEnabled, setBankTransferEnabledState, setBankToggleLoading);
  const toggleQrisGateway = () =>
    toggleSetting("qris_gateway_enabled", !qrisGatewayEnabled, setQrisGatewayEnabledState, setQrisGatewayToggleLoading);
  const toggleQrisBridge = () =>
    toggleSetting("qris_bridge_enabled", !qrisBridgeEnabled, setQrisBridgeEnabledState, setQrisBridgeToggleLoading);

  const recheckGateway = useCallback(async (orderId: string) => {
    setActionLoading(orderId);
    setNotice(null);
    const res = await fetch(`/api/order/${orderId}/gateway-status`);
    const data = await res.json();
    setNotice(
      data.success
        ? { ok: true, text: `Status Bayar.gg: ${data.data?.status ?? "?"}` }
        : { ok: false, text: data.message ?? "Gagal cek status." }
    );
    setActionLoading(null);
    await refreshOneOrder(orderId);
  }, [refreshOneOrder]);

  const recheckBridge = useCallback(async (orderId: string) => {
    setActionLoading(orderId);
    setNotice(null);
    const res = await fetch(`/api/order/${orderId}/bridge-status`);
    const data = await res.json();
    setNotice(
      data.success
        ? { ok: true, text: `Status Bridge: ${data.data?.status ?? "?"}` }
        : { ok: false, text: data.message ?? "Gagal cek status." }
    );
    setActionLoading(null);
    await refreshOneOrder(orderId);
  }, [refreshOneOrder]);

  const confirmOrder = useCallback(async (orderId: string) => {
    setActionLoading(orderId);
    setNotice(null);
    const res = await fetch("/api/admin/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const data = await res.json();
    setNotice({ ok: !!data.success, text: data.message ?? (data.success ? "Berhasil." : "Gagal.") });
    setActionLoading(null);
    await refreshOneOrder(orderId);
  }, [refreshOneOrder]);

  const rejectOrder = useCallback(async (orderId: string, refundEligible: boolean) => {
    const reason = window.prompt("Alasan penolakan (opsional):");
    if (reason === null) return; // dialog dibatalkan
    const refund = refundEligible ? window.confirm("Kembalikan dana ke saldo user?") : false;
    setActionLoading(orderId);
    setNotice(null);
    const res = await fetch("/api/admin/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, reason, refund }),
    });
    const data = await res.json();
    setNotice({ ok: !!data.success, text: data.message ?? (data.success ? "Berhasil." : "Gagal.") });
    setActionLoading(null);
    await refreshOneOrder(orderId);
  }, [refreshOneOrder]);

  const filters = ["ALL", "PENDING_PAYMENT", "AWAITING_RETRY", "COMPLETED", "FAILED", "REJECTED"];
  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  // Semua statistik dihitung di klien dari orders yang sudah di-fetch.
  const totalRevenue = orders.filter((o) => o.status === "COMPLETED").reduce((s, o) => s + o.sellPrice, 0);
  const pendingCount = orders.filter((o) => o.status === "PENDING_PAYMENT").length;
  const failedCount = orders.filter((o) => o.status === "FAILED").length;

  const rowProps = (order: AdminOrder): OrderCardProps => ({
    order,
    isLoading: actionLoading === order.id,
    onConfirm: confirmOrder,
    onReject: rejectOrder,
    onRecheckGateway: recheckGateway,
    onRecheckBridge: recheckBridge,
  });

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <DashboardHeader title="Admin" subtitle="Kelola pesanan, saldo, dan pengaturan toko." />

      <Reveal onMount stagger={0.06} className="grid grid-cols-3 gap-2 md:gap-5 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <Stat label="Pendapatan" value={formatPrice(totalRevenue)} dark loading={loading} />
        <Stat label="Pesanan masuk" short="Masuk" value={String(orders.length)} loading={loading} />
        <Stat label="Menunggu konfirmasi" short="Menunggu" value={String(pendingCount)} loading={loading} />
        <Stat label="Gagal diproses" short="Gagal" value={String(failedCount)} loading={loading} />
      </Reveal>

      {notice && (
        <div
          role={notice.ok ? "status" : "alert"}
          key={notice.text}
          className={`kr-fade-in flex items-start gap-2 rounded-2xl px-4 py-3 text-[13px] font-medium ${
            notice.ok ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
          }`}
        >
          {notice.ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />}
          {notice.text}
        </div>
      )}

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <h2 className="text-xl font-semibold md:text-2xl">Pesanan perlu tindakan</h2>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className="kr-chip kr-press shrink-0"
              >
                {f === "ALL" ? `Semua (${orders.length})` : `${statusLabel[f]} (${orders.filter((o) => o.status === f).length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3" role="status" aria-label="Memuat pesanan">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-28 w-full" radius="rounded-[22px]" />
              ))}
            </div>
          ) : error ? (
            <div role="alert" className="kr-fade-in rounded-2xl bg-danger-bg px-6 py-4 text-sm font-medium text-danger">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="kr-fade-in py-16 text-center text-sm font-medium text-muted">Tidak ada order.</div>
          ) : (
            <>
              <div className={`${cardClass} kr-fade-in hidden overflow-x-auto p-2 md:block`}>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-muted">
                      <th className="px-4 py-3 font-semibold">Pembeli</th>
                      <th className="w-[110px] px-4 py-3 font-semibold">Total</th>
                      <th className="w-[130px] px-4 py-3 font-semibold">Status</th>
                      <th className="w-[200px] px-4 py-3 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order, i) => (
                      <OrderRow key={order.id} index={i} {...rowProps(order)} />
                    ))}
                  </tbody>
                </table>
              </div>
              <Reveal onMount stagger={0.04} className="flex flex-col gap-3 md:hidden">
                {filtered.map((order) => (
                  <RevealItem key={order.id}>
                    <OrderCard {...rowProps(order)} />
                  </RevealItem>
                ))}
              </Reveal>
            </>
          )}
        </section>

        <aside style={{ animationDelay: "150ms" }} className={`${cardClass} kr-fade-up flex w-full flex-col gap-4 p-6 xl:w-[380px] xl:shrink-0`}>
          <h2 className="text-xl font-semibold">Pengaturan toko</h2>
          <form onSubmit={saveMarkup} className="flex flex-col gap-2">
            <label htmlFor="markup" className="text-sm font-semibold">Markup harga (%)</label>
            <input
              id="markup"
              type="number"
              min={0}
              max={1000}
              step={0.1}
              value={markup}
              onChange={(e) => setMarkup(e.target.value === "" ? "" : Number(e.target.value))}
              className={fieldClass}
              placeholder="0"
            />
            <p className="text-[13px] text-muted">Persentase markup yang diterapkan ke semua harga produk.</p>
            <button type="submit" disabled={markupLoading} className={`${buttonClass("primary")} w-full`}>
              {markupLoading ? "..." : "Simpan pengaturan"}
            </button>
            {markupMsg && <div key={markupMsg} role="status" className="kr-fade-in text-[13px] font-medium text-success">{markupMsg}</div>}
          </form>

          <ToggleRow
            title="Transfer Bank Manual"
            description="Nyalakan/matikan opsi transfer bank di checkout."
            enabled={bankTransferEnabled}
            loading={bankToggleLoading}
            onToggle={toggleBankTransfer}
          />
          <ToggleRow
            title="QRIS (Bayar.gg)"
            description="Nyalakan/matikan opsi QRIS otomatis via Bayar.gg di checkout."
            enabled={qrisGatewayEnabled}
            loading={qrisGatewayToggleLoading}
            onToggle={toggleQrisGateway}
          />
          <ToggleRow
            title="QRIS Instan (Bridge)"
            description="Nyalakan/matikan opsi QRIS Instan via payment bridge di checkout."
            enabled={qrisBridgeEnabled}
            loading={qrisBridgeToggleLoading}
            onToggle={toggleQrisBridge}
          />
        </aside>
      </div>
    </div>
  );
}
