"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

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

const paymentMethodLabel: Record<string, string> = {
  QRIS_GATEWAY: "⚡ QRIS (Bayar.gg)",
  QRIS: "📱 QRIS (manual)",
  BANK_TRANSFER: "🏦 Transfer Bank",
};

interface OrderCardProps {
  order: AdminOrder;
  isLoading: boolean;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
  onRecheckGateway: (id: string) => void;
}

const OrderCard = memo(function OrderCard({ order, isLoading, onConfirm, onReject, onRecheckGateway }: OrderCardProps) {
  return (
    <GlassCard className="p-5">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge color={statusColor[order.status] ?? "default"}>{statusLabel[order.status] ?? order.status}</Badge>
            <span className="text-[11px] text-white/30 font-mono truncate">{order.id}</span>
          </div>
          <div className="text-[14px] font-medium text-white mb-0.5">
            {order.productName} — {order.variantName}
          </div>
          <div className="text-[12px] text-white/40 mb-2">
            {order.user.name ?? order.user.email} · {formatDate(order.createdAt)}
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[12px]">
            <div className="text-white/30">Jumlah: <span className="text-white">{order.quantity}x</span></div>
            <div className="text-white/30">Harga Jual: <span className="text-white">{formatPrice(order.sellPrice)}</span></div>
            <div className="text-white/30">Cost: <span className="text-white/60">{formatPrice(order.costPrice)}</span></div>
            <div className="text-white/30">Profit: <span className="text-secondary">{formatPrice(order.sellPrice - order.costPrice)}</span></div>
            <div className="text-white/30">Metode: <span className="text-white">{paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}</span></div>
            {order.uniqueCode > 0 && (
              <div className="col-span-2 text-white/30">
                Nominal Transfer: <span className="text-tertiary font-semibold">{formatPrice(order.sellPrice + order.uniqueCode)}</span>
                <span className="text-white/20 ml-1">(kode: +{order.uniqueCode})</span>
              </div>
            )}
            {order.paymentRef && (
              <div className="col-span-2 text-white/30">Ref: <span className="text-white font-mono">{order.paymentRef}</span></div>
            )}
            {order.apiOrderId && (
              <div className="col-span-2 text-white/30">API ID: <span className="text-white/60 font-mono text-[11px]">{order.apiOrderId}</span></div>
            )}
            {order.gatewayInvoiceId && (
              <div className="col-span-2 text-white/30">
                Invoice Bayar.gg: <span className="text-white/60 font-mono text-[11px]">{order.gatewayInvoiceId}</span>
                {order.gatewayStatus && <span className="text-white/20 ml-1">({order.gatewayStatus})</span>}
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
          <div className="flex gap-2 flex-shrink-0">
            {order.status === "AWAITING_RETRY" ? (
              <>
                <button
                  onClick={() => onConfirm(order.id)}
                  disabled={isLoading}
                  className="glass rounded-[2px] px-4 py-2 text-[12px] font-medium border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors cursor-pointer disabled:opacity-40"
                >
                  {isLoading ? "..." : "🔁 Retry Fulfillment"}
                </button>
                <button
                  onClick={() => onReject(order.id)}
                  disabled={isLoading}
                  className="glass rounded-[2px] px-4 py-2 text-[12px] font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-colors cursor-pointer disabled:opacity-40"
                >
                  Tolak
                </button>
              </>
            ) : order.paymentMethod === "QRIS_GATEWAY" ? (
              <button
                onClick={() => onRecheckGateway(order.id)}
                disabled={isLoading}
                className="glass rounded-[2px] px-4 py-2 text-[12px] font-medium border border-tertiary/40 text-tertiary hover:bg-tertiary/10 transition-colors cursor-pointer disabled:opacity-40"
              >
                {isLoading ? "..." : "Cek status Bayar.gg"}
              </button>
            ) : (
              <>
                <button
                  onClick={() => onConfirm(order.id)}
                  disabled={isLoading}
                  className="glass rounded-[2px] px-4 py-2 text-[12px] font-medium border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors cursor-pointer disabled:opacity-40"
                >
                  {isLoading ? "..." : "Konfirmasi"}
                </button>
                <button
                  onClick={() => onReject(order.id)}
                  disabled={isLoading}
                  className="glass rounded-[2px] px-4 py-2 text-[12px] font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-colors cursor-pointer disabled:opacity-40"
                >
                  Tolak
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
});

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

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
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
        router.replace("/");
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
    setMsg("");
    const res = await fetch(`/api/order/${orderId}/gateway-status`);
    const data = await res.json();
    setMsg(data.success ? `✓ Status Bayar.gg: ${data.data?.status ?? "?"}` : `✗ ${data.message}`);
    setActionLoading(null);
    await refreshOneOrder(orderId);
  }, [refreshOneOrder]);

  const confirm = useCallback(async (orderId: string) => {
    setActionLoading(orderId);
    setMsg("");
    const res = await fetch("/api/admin/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const data = await res.json();
    setMsg(data.success ? `✓ ${data.message}` : `✗ ${data.message}`);
    setActionLoading(null);
    await refreshOneOrder(orderId);
  }, [refreshOneOrder]);

  const reject = useCallback(async (orderId: string) => {
    const reason = prompt("Alasan penolakan (opsional):");
    setActionLoading(orderId);
    setMsg("");
    const res = await fetch("/api/admin/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, reason }),
    });
    const data = await res.json();
    setMsg(data.success ? `✓ ${data.message}` : `✗ ${data.message}`);
    setActionLoading(null);
    await refreshOneOrder(orderId);
  }, [refreshOneOrder]);

  const filters = ["ALL", "PENDING_PAYMENT", "AWAITING_RETRY", "COMPLETED", "FAILED", "REJECTED"];
  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  const totalRevenue = orders.filter((o) => o.status === "COMPLETED").reduce((s, o) => s + o.sellPrice, 0);
  const totalProfit = orders.filter((o) => o.status === "COMPLETED").reduce((s, o) => s + (o.sellPrice - o.costPrice), 0);
  const pendingCount = orders.filter((o) => o.status === "PENDING_PAYMENT").length;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-[32px] font-semibold text-white tracking-tight mb-1">Admin Dashboard</h1>
            <p className="text-[13px] text-white/30">Kelola order masuk dan konfirmasi pembayaran.</p>
          </div>

          {/* Markup Setting */}
          <GlassCard className="p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="text-[12px] text-white/40 mb-0.5">Markup Harga</div>
                <div className="text-[11px] text-white/25">Persentase markup yang diterapkan ke semua harga produk.</div>
              </div>
              <form onSubmit={saveMarkup} className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 glass border border-white/10 rounded-[2px] px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    max={1000}
                    step={0.1}
                    value={markup}
                    onChange={(e) => setMarkup(e.target.value === "" ? "" : Number(e.target.value))}
                    className="bg-transparent text-[14px] text-white w-16 focus:outline-none"
                    placeholder="0"
                  />
                  <span className="text-[13px] text-white/40">%</span>
                </div>
                <button
                  type="submit"
                  disabled={markupLoading}
                  className="glass rounded-[2px] px-4 py-2 text-[12px] font-medium border border-secondary/40 text-white hover:bg-secondary/10 transition-colors cursor-pointer disabled:opacity-40"
                >
                  {markupLoading ? "..." : "Simpan"}
                </button>
              </form>
            </div>
            {markupMsg && (
              <div className="mt-3 text-[12px] text-secondary/80">{markupMsg}</div>
            )}

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="text-[12px] text-white/40 mb-0.5">Transfer Bank Manual</div>
                <div className="text-[11px] text-white/25">Nyalakan/matikan opsi transfer bank di checkout. QRIS otomatis (Bayar.gg) selalu aktif.</div>
              </div>
              <button
                onClick={toggleBankTransfer}
                disabled={bankToggleLoading}
                className={`glass rounded-[2px] px-4 py-2 text-[12px] font-medium border transition-colors cursor-pointer disabled:opacity-40 flex-shrink-0 ${
                  bankTransferEnabled ? "border-secondary/40 text-secondary hover:bg-secondary/10" : "border-white/10 text-white/40 hover:bg-white/10"
                }`}
              >
                {bankToggleLoading ? "..." : bankTransferEnabled ? "Aktif" : "Nonaktif"}
              </button>
            </div>
          </GlassCard>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {[
              { label: "Total Order", value: String(orders.length) },
              { label: "User Terdaftar", value: String(userCount) },
              { label: "Pending", value: String(pendingCount), highlight: pendingCount > 0 },
              { label: "Revenue", value: formatPrice(totalRevenue) },
              { label: "Profit", value: formatPrice(totalProfit) },
            ].map((s) => (
              <GlassCard key={s.label} className="p-4">
                <div className="text-[11px] text-white/30 mb-1">{s.label}</div>
                <div className={`text-[18px] font-semibold ${s.highlight ? "text-tertiary" : "text-white"}`}>{s.value}</div>
              </GlassCard>
            ))}
          </div>

          {msg && (
            <div className={`mb-4 px-4 py-3 rounded-[2px] text-[13px] border ${msg.startsWith("✓") ? "border-secondary/30 text-secondary bg-secondary/10" : "border-primary/30 text-primary bg-primary/10"}`}>
              {msg}
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap mb-4">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  filter === f ? "border-white/40 text-white bg-white/10" : "border-white/10 text-white/40 hover:text-white"
                }`}
              >
                {f === "ALL" ? `Semua (${orders.length})` : `${statusLabel[f]} (${orders.filter((o) => o.status === f).length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-white/30 text-[14px]">Memuat...</div>
          ) : error ? (
            <div className="glass rounded-[2px] px-6 py-4 border border-primary/30 text-primary text-[14px]">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-white/30 text-[14px]">Tidak ada order.</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isLoading={actionLoading === order.id}
                  onConfirm={confirm}
                  onReject={reject}
                  onRecheckGateway={recheckGateway}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
