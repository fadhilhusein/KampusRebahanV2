"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  Landmark,
  QrCode,
  Receipt,
  RotateCw,
  SlidersHorizontal,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const cardClass = "rounded-2xl border border-foreground/20 bg-surface";

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
  QRIS: { label: "QRIS (manual)", icon: QrCode },
  BANK_TRANSFER: { label: "Transfer Bank", icon: Landmark },
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
  createdAt: string;
  user: { email: string; name: string | null };
}

interface OrderCardProps {
  order: AdminOrder;
  isLoading: boolean;
  onConfirm: (id: string) => void;
  onReject: (id: string, refundEligible: boolean) => void;
  onRecheckGateway: (id: string) => void;
}

const REFUND_ELIGIBLE_STATUSES = ["PAID", "PROCESSING", "AWAITING_RETRY", "COMPLETED"];

const actionBtn =
  "flex items-center gap-1.5 rounded-xl border px-4 py-2 text-[12px] font-semibold transition-colors cursor-pointer disabled:opacity-40";
const confirmBtn = `${actionBtn} border-secondary/40 text-secondary hover:bg-secondary/10`;
const rejectBtn = `${actionBtn} border-primary/30 text-primary hover:bg-primary/10`;

const OrderCard = memo(function OrderCard({ order, isLoading, onConfirm, onReject, onRecheckGateway }: OrderCardProps) {
  const method = paymentMethodInfo[order.paymentMethod];
  const MethodIcon = method?.icon;

  return (
    <div className={`${cardClass} p-5`}>
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge color={statusColor[order.status] ?? "default"}>{statusLabel[order.status] ?? order.status}</Badge>
            <span className="text-[11px] text-foreground/40 font-mono truncate">{order.id}</span>
          </div>
          <div className="text-[14px] font-semibold text-foreground mb-0.5">
            {order.productName} — {order.variantName}
          </div>
          <div className="text-[12px] text-foreground/50 mb-3">
            {order.user.name ?? order.user.email} · {formatDate(order.createdAt)}
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[12px]">
            <div className="text-foreground/40">Jumlah: <span className="font-medium text-foreground">{order.quantity}x</span></div>
            <div className="text-foreground/40">Harga Jual: <span className="font-medium text-foreground">{formatPrice(order.sellPrice)}</span></div>
            <div className="text-foreground/40">Cost: <span className="text-foreground/60">{formatPrice(order.costPrice)}</span></div>
            <div className="text-foreground/40">Profit: <span className="font-medium text-secondary">{formatPrice(order.sellPrice - order.costPrice)}</span></div>
            <div className="flex items-center gap-1.5 text-foreground/40">
              Metode:
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                {MethodIcon && <MethodIcon size={12} />}
                {method?.label ?? order.paymentMethod}
              </span>
            </div>
            {order.uniqueCode > 0 && (
              <div className="col-span-2 text-foreground/40">
                Nominal Transfer: <span className="text-tertiary font-semibold">{formatPrice(order.sellPrice + order.uniqueCode)}</span>
                <span className="text-foreground/30 ml-1">(kode: +{order.uniqueCode})</span>
              </div>
            )}
            {order.paymentRef && (
              <div className="col-span-2 text-foreground/40">Ref: <span className="text-foreground font-mono">{order.paymentRef}</span></div>
            )}
            {order.apiOrderId && (
              <div className="col-span-2 text-foreground/40">API ID: <span className="text-foreground/60 font-mono text-[11px]">{order.apiOrderId}</span></div>
            )}
            {order.gatewayInvoiceId && (
              <div className="col-span-2 text-foreground/40">
                Invoice Bayar.gg: <span className="text-foreground/60 font-mono text-[11px]">{order.gatewayInvoiceId}</span>
                {order.gatewayStatus && <span className="text-foreground/30 ml-1">({order.gatewayStatus})</span>}
              </div>
            )}
            {order.status === "AWAITING_RETRY" && order.apiResponse != null && (
              <div className="col-span-2 text-primary/70">
                Alasan gagal: <span className="font-mono text-[11px]">
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
        </div>

        {(order.status === "PENDING_PAYMENT" || order.status === "PAID" || order.status === "AWAITING_RETRY") && (
          <div className="flex gap-2 flex-shrink-0 flex-wrap">
            {order.status === "AWAITING_RETRY" ? (
              <>
                <button onClick={() => onConfirm(order.id)} disabled={isLoading} className={confirmBtn}>
                  <RotateCw size={13} />
                  {isLoading ? "..." : "Retry Fulfillment"}
                </button>
                <button
                  onClick={() => onReject(order.id, REFUND_ELIGIBLE_STATUSES.includes(order.status))}
                  disabled={isLoading}
                  className={rejectBtn}
                >
                  Tolak
                </button>
              </>
            ) : order.paymentMethod === "QRIS_GATEWAY" ? (
              <button
                onClick={() => onRecheckGateway(order.id)}
                disabled={isLoading}
                className={`${actionBtn} border-tertiary/40 text-tertiary hover:bg-tertiary/10`}
              >
                <RotateCw size={13} />
                {isLoading ? "..." : "Cek status Bayar.gg"}
              </button>
            ) : (
              <>
                <button onClick={() => onConfirm(order.id)} disabled={isLoading} className={confirmBtn}>
                  {isLoading ? "..." : "Konfirmasi"}
                </button>
                <button
                  onClick={() => onReject(order.id, REFUND_ELIGIBLE_STATUSES.includes(order.status))}
                  disabled={isLoading}
                  className={rejectBtn}
                >
                  Tolak
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

interface StatProps {
  label: string;
  value: string;
  icon: LucideIcon;
  highlight?: boolean;
  loading: boolean;
}

function Stat({ label, value, icon: Icon, highlight, loading }: StatProps) {
  return (
    <div className={`${cardClass} p-4`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-foreground/50">{label}</span>
        <Icon size={15} className={highlight ? "text-tertiary" : "text-foreground/40"} />
      </div>
      {loading ? (
        <Skeleton className="h-6 w-20" radius="rounded-lg" />
      ) : (
        <div className={`text-[18px] font-bold ${highlight ? "text-tertiary" : "text-foreground"}`}>{value}</div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [userCount, setUserCount] = useState(0);
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
        setUserCount(data.userCount ?? 0);
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

  async function toggleBankTransfer() {
    const next = !bankTransferEnabled;
    setBankToggleLoading(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bank_transfer_enabled: next }),
    });
    const data = await res.json();
    if (data.success) setBankTransferEnabledState(next);
    setBankToggleLoading(false);
  }

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

  const totalRevenue = orders.filter((o) => o.status === "COMPLETED").reduce((s, o) => s + o.sellPrice, 0);
  const totalProfit = orders.filter((o) => o.status === "COMPLETED").reduce((s, o) => s + (o.sellPrice - o.costPrice), 0);
  const pendingCount = orders.filter((o) => o.status === "PENDING_PAYMENT").length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-foreground leading-tight tracking-tight mb-1">Kelola Order</h1>
        <p className="text-[14px] text-foreground/50">Kelola order masuk dan konfirmasi pembayaran.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Stat label="Total Order" value={String(orders.length)} icon={Receipt} loading={loading} />
        <Stat label="User Terdaftar" value={String(userCount)} icon={Users} loading={loading} />
        <Stat label="Pending" value={String(pendingCount)} icon={Clock} highlight={pendingCount > 0} loading={loading} />
        <Stat label="Revenue" value={formatPrice(totalRevenue)} icon={Banknote} loading={loading} />
        <Stat label="Profit" value={formatPrice(totalProfit)} icon={TrendingUp} loading={loading} />
      </div>

      {/* Settings */}
      <div className={`${cardClass} p-5 mb-8`}>
        <h2 className="mb-4 flex items-center gap-2 text-[14px] font-bold text-foreground">
          <SlidersHorizontal size={15} className="text-primary" />
          Pengaturan
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-foreground/80 mb-0.5">Markup Harga</div>
            <div className="text-[12px] text-foreground/40">Persentase markup yang diterapkan ke semua harga produk.</div>
          </div>
          <form onSubmit={saveMarkup} className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 rounded-xl border border-foreground/15 bg-background px-3 py-2">
              <input
                type="number"
                min={0}
                max={1000}
                step={0.1}
                value={markup}
                onChange={(e) => setMarkup(e.target.value === "" ? "" : Number(e.target.value))}
                className="bg-transparent text-[14px] text-foreground w-16 focus:outline-none"
                placeholder="0"
                aria-label="Persentase markup"
              />
              <span className="text-[13px] text-foreground/40">%</span>
            </div>
            <button
              type="submit"
              disabled={markupLoading}
              className={`${actionBtn} border-secondary/40 text-foreground hover:bg-secondary/10`}
            >
              {markupLoading ? "..." : "Simpan"}
            </button>
          </form>
        </div>
        {markupMsg && <div className="mt-3 text-[12px] font-medium text-secondary">{markupMsg}</div>}

        <div className="mt-4 pt-4 border-t border-foreground/10 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-foreground/80 mb-0.5">Transfer Bank Manual</div>
            <div className="text-[12px] text-foreground/40">
              Nyalakan/matikan opsi transfer bank di checkout. QRIS otomatis (Bayar.gg) selalu aktif.
            </div>
          </div>
          <button
            onClick={toggleBankTransfer}
            disabled={bankToggleLoading}
            className={`${actionBtn} flex-shrink-0 ${
              bankTransferEnabled
                ? "border-secondary/40 text-secondary hover:bg-secondary/10"
                : "border-foreground/15 text-foreground/50 hover:bg-foreground/10"
            }`}
          >
            {bankToggleLoading ? "..." : bankTransferEnabled ? "Aktif" : "Nonaktif"}
          </button>
        </div>
      </div>

      {notice && (
        <div
          role={notice.ok ? "status" : "alert"}
          className={`mb-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-[13px] font-medium ${
            notice.ok ? "border-secondary/30 bg-secondary/10 text-secondary" : "border-primary/30 bg-primary/10 text-primary"
          }`}
        >
          {notice.ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
          {notice.text}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[12px] font-semibold px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
              filter === f
                ? "border-foreground/40 text-foreground bg-foreground/10"
                : "border-foreground/15 text-foreground/50 hover:text-foreground"
            }`}
          >
            {f === "ALL" ? `Semua (${orders.length})` : `${statusLabel[f]} (${orders.filter((o) => o.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-40 w-full" radius="rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-6 py-4 text-[14px] font-medium text-primary">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-foreground/40 text-[14px] font-medium">Tidak ada order.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isLoading={actionLoading === order.id}
              onConfirm={confirmOrder}
              onReject={rejectOrder}
              onRecheckGateway={recheckGateway}
            />
          ))}
        </div>
      )}
    </div>
  );
}
