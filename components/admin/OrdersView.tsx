"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleDashed, Copy, Hand, Info, Landmark, Mail, MessageCircle, QrCode, Search, Wallet, X as XIcon } from "lucide-react";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import RefundDialog from "@/components/dashboard/RefundDialog";
import { AdminHeader, useAdminSummary } from "@/components/admin/AdminShell";
import {
  type AdminOrder,
  REFUND_ELIGIBLE_STATUSES,
  Sheet,
  StatusBadge,
  copyText,
  failureReason,
  formatDateTime,
  formatPrice,
  isManual,
  manualChannelLabel,
  methodLabel,
  needsAction,
  orderStatusKey,
  timeAgo,
} from "@/components/admin/shared";

type ActionKind = "retry" | "confirm" | "gateway" | "bridge" | "refund" | "manual" | "complete";

function MethodIcon({ method, size, className }: { method: string; size: number; className?: string }) {
  const props = { size, className, "aria-hidden": true as const };
  if (method === "BANK_TRANSFER") return <Landmark {...props} />;
  if (method.startsWith("QRIS")) return <QrCode {...props} />;
  return <Wallet {...props} />;
}

const isRefundable = (o: AdminOrder) => !o.refundedAt && REFUND_ELIGIBLE_STATUSES.includes(o.status);
// Paid but not delivered yet, and not already handed to the admin.
const canProcessManually = (o: AdminOrder) => !o.refundedAt && !o.manualAt && ["PAID", "PROCESSING", "AWAITING_RETRY"].includes(o.status);
const isRejectable = (o: AdminOrder) => isRefundable(o) || (o.status === "PENDING_PAYMENT" && o.paymentMethod === "BANK_TRANSFER");

/** The one action the card/row shows for an order, by status. */
function primaryAction(o: AdminOrder): { kind: ActionKind; label: string; style: "primary" | "secondary" | "danger" } | null {
  if (isManual(o)) return { kind: "complete", label: "Tandai selesai", style: "primary" };
  if (o.status === "AWAITING_RETRY") return { kind: "retry", label: "Retry", style: "primary" };
  if (o.status === "PAID" && o.paymentMethod === "BANK_TRANSFER") return { kind: "confirm", label: "Konfirmasi", style: "primary" };
  // Transfer arrived after the payment window: the admin can still confirm once the money is seen.
  if (o.status === "EXPIRED" && o.paymentMethod === "BANK_TRANSFER") return { kind: "confirm", label: "Konfirmasi", style: "secondary" };
  if ((o.status === "PENDING_PAYMENT" || o.status === "PAID") && o.paymentMethod === "QRIS_GATEWAY") return { kind: "gateway", label: "Cek status", style: "secondary" };
  if ((o.status === "PENDING_PAYMENT" || o.status === "PAID") && o.paymentMethod === "QRIS_BRIDGE") return { kind: "bridge", label: "Cek status", style: "secondary" };
  if ((o.status === "PROCESSING" || o.status === "COMPLETED") && isRefundable(o)) return { kind: "refund", label: "Refund", style: "danger" };
  return null;
}

const filters: { id: string; label: string; match: (o: AdminOrder) => boolean }[] = [
  { id: "action", label: "Perlu tindakan", match: needsAction },
  { id: "processing", label: "Diproses", match: (o) => o.status === "PROCESSING" },
  { id: "retry", label: "Perlu retry", match: (o) => o.status === "AWAITING_RETRY" },
  { id: "unpaid", label: "Menunggu bayar", match: (o) => o.status === "PENDING_PAYMENT" },
  { id: "completed", label: "Selesai", match: (o) => o.status === "COMPLETED" },
  { id: "refunded", label: "Direfund", match: (o) => orderStatusKey(o) === "REFUNDED" },
  { id: "all", label: "Semua", match: () => true },
];

function ActionButton({ order, busy, onAction, full }: { order: AdminOrder; busy: boolean; onAction: (o: AdminOrder, k: ActionKind) => void; full?: boolean }) {
  const a = primaryAction(order);
  if (!a) return <span className="text-[13px] text-muted">Tidak ada aksi</span>;
  return (
    <button
      type="button"
      disabled={busy}
      onClick={(e) => {
        e.stopPropagation();
        onAction(order, a.kind);
      }}
      className={`${buttonClass(a.style)} min-h-11 shrink-0 px-5 ${full ? "w-full" : ""}`}
    >
      {busy ? "..." : a.label}
    </button>
  );
}

type RowProps = { order: AdminOrder; busy: boolean; onAction: (o: AdminOrder, k: ActionKind) => void; onOpen: (id: string) => void };

const OrderCard = memo(function OrderCard({ order, busy, onAction, onOpen }: RowProps) {
  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(order.id)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen(order.id))}
        aria-label={`Detail pesanan ${order.productName}`}
        className="kr-press flex cursor-pointer flex-col gap-3 rounded-[24px] bg-surface p-4 text-left shadow-card"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-pill text-ink">
            <MethodIcon method={order.paymentMethod} size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="line-clamp-2 text-[15px] font-semibold leading-snug">{order.productName} · {order.variantName}</span>
            <span className="block truncate text-[13px] text-muted">{order.user.email}</span>
          </span>
          <StatusBadge statusKey={orderStatusKey(order)} />
        </div>
        <div className="flex items-end justify-between gap-3">
          <span className="min-w-0">
            <span className="block font-display text-[22px] font-bold leading-tight tabular-nums">{formatPrice(order.sellPrice)}</span>
            <span className="block text-xs text-muted">{methodLabel[order.paymentMethod] ?? order.paymentMethod} · {timeAgo(order.createdAt)}</span>
          </span>
          <ActionButton order={order} busy={busy} onAction={onAction} />
        </div>
      </div>
    </li>
  );
});

const OrderRow = memo(function OrderRow({ order, busy, onAction, onOpen }: RowProps) {
  return (
    <tr onClick={() => onOpen(order.id)} className="cursor-pointer border-t border-hairline hover:bg-card">
      <td className="px-4 py-3.5">
        <button type="button" onClick={(e) => { e.stopPropagation(); onOpen(order.id); }} className="text-left">
          <span className="block max-w-[320px] truncate text-sm font-semibold">{order.productName} · {order.variantName}</span>
          <span className="block font-mono text-xs text-muted">#{order.id.slice(-8).toUpperCase()}</span>
        </button>
      </td>
      <td className="max-w-[240px] truncate px-4 py-3.5 text-sm text-muted">{order.user.email}</td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm">
        <span className="inline-flex items-center gap-1.5"><MethodIcon method={order.paymentMethod} size={15} className="text-muted" />{methodLabel[order.paymentMethod] ?? order.paymentMethod}</span>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-semibold tabular-nums">{formatPrice(order.sellPrice)}</td>
      <td className="px-4 py-3.5"><StatusBadge statusKey={orderStatusKey(order)} /></td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted">{timeAgo(order.createdAt)}</td>
      <td className="px-4 py-3.5"><ActionButton order={order} busy={busy} onAction={onAction} /></td>
    </tr>
  );
});

function Step({ label, time, state }: { label: string; time?: string; state: "done" | "failed" | "manual" | "todo" }) {
  const tone =
    state === "done" ? "bg-success-bg text-success" : state === "failed" ? "bg-danger-bg text-danger" : state === "manual" ? "bg-warn-bg text-warn" : "bg-pill text-muted";
  const Icon = state === "done" ? Check : state === "failed" ? XIcon : state === "manual" ? Hand : CircleDashed;
  return (
    <li className="flex flex-1 flex-col items-center gap-1 text-center">
      <span className={`flex size-9 items-center justify-center rounded-full ${tone}`}><Icon size={16} aria-hidden="true" /></span>
      <span className="text-[13px] font-semibold">{label}</span>
      <span className="text-[11px] text-muted">{time ?? "–"}</span>
    </li>
  );
}

function OrderSheet({ order, busy, onAction, onClose }: { order: AdminOrder | null; busy: boolean; onAction: (o: AdminOrder, k: ActionKind) => void; onClose: () => void }) {
  const { addToast } = useToast();
  if (!order) return <Sheet open={false} onClose={onClose} title="" labelId="order-sheet">{null}</Sheet>;

  const paid = REFUND_ELIGIBLE_STATUSES.includes(order.status) || !!order.refundedAt;
  const failed = order.status === "AWAITING_RETRY";
  const reason = failureReason(order);
  const rawGateway = order.gatewayStatus ?? order.bridgeStatus;
  const gateway = rawGateway ? ({ paid: "Lunas", pending: "Menunggu", expired: "Kedaluwarsa", failed: "Gagal", cancelled: "Dibatalkan" } as Record<string, string>)[rawGateway.toLowerCase()] ?? rawGateway : null;
  const manual = isManual(order);
  const supplier = manual
    ? "Ditangani manual"
    : order.status === "COMPLETED"
      ? order.manualAt ? "Dikirim manual" : "Selesai"
      : failed ? "Gagal" : order.apiOrderId ? "Diteruskan, menunggu supplier" : "Belum diteruskan";
  const rows: [string, React.ReactNode][] = [
    ["Pembeli", order.user.name ? `${order.user.name} · ${order.user.email}` : order.user.email],
    ["Metode", methodLabel[order.paymentMethod] ?? order.paymentMethod],
    ["Dibayar", formatPrice(order.sellPrice)],
    ["Modal", formatPrice(order.costPrice)],
    ["Profit", <span key="p" className="text-success">{formatPrice(order.sellPrice - order.costPrice)}</span>],
    ...(order.uniqueCode > 0 ? ([["Nominal transfer", <span key="u" className="text-warn">{formatPrice(order.sellPrice + order.uniqueCode)}</span>]] as [string, React.ReactNode][]) : []),
    ...(gateway ? ([["Pembayaran gateway", gateway]] as [string, React.ReactNode][]) : []),
    ["Status supplier", <span key="s" className={failed ? "text-danger" : manual ? "text-warn" : ""}>{supplier}</span>],
  ];
  const a = primaryAction(order);

  return (
    <Sheet
      open
      onClose={onClose}
      labelId="order-sheet"
      title={`${order.productName} · ${order.variantName}`}
      subtitle={<StatusBadge statusKey={orderStatusKey(order)} />}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-sm">
          <span className="font-mono font-semibold">#{order.id.slice(-8).toUpperCase()}</span>
          <span className="text-muted"> · {formatDateTime(order.createdAt)}</span>
        </span>
        <button
          type="button"
          onClick={async () => addToast((await copyText(order.id)) ? "ID pesanan disalin." : "Gagal menyalin.", "success")}
          className={`${buttonClass("secondary", "sm")} min-h-11 shrink-0`}
        >
          <Copy size={15} aria-hidden="true" /> Salin ID
        </button>
      </div>

      <dl className="flex flex-col gap-2.5 rounded-[18px] bg-card p-4 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="shrink-0 text-muted">{k}</dt>
            <dd className="min-w-0 text-right font-semibold [overflow-wrap:anywhere]">{v}</dd>
          </div>
        ))}
      </dl>

      {order.manualAt && (
        <p className="flex gap-2.5 rounded-[16px] bg-card px-4 py-3 text-[13px] font-medium">
          {order.manualChannel === "EMAIL" ? <Mail size={16} aria-hidden="true" className="mt-0.5 shrink-0" /> : <MessageCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />}
          <span className="[overflow-wrap:anywhere]">
            {manual
              ? `Diproses manual via ${manualChannelLabel(order.manualChannel)} sejak ${formatDateTime(order.manualAt)}. Kirim akunnya ke customer, lalu tandai selesai.`
              : `Dikirim manual via ${manualChannelLabel(order.manualChannel)}.`}
            {order.manualNote && <span className="mt-1 block text-muted">Catatan untuk customer: {order.manualNote}</span>}
          </span>
        </p>
      )}

      {!manual && (reason || order.paymentNote) && (
        <p className="flex gap-2.5 rounded-[16px] bg-warn-bg px-4 py-3 text-[13px] font-medium text-warn">
          <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span className="[overflow-wrap:anywhere]">{reason ? `Alasan gagal: ${reason}` : order.paymentNote}</span>
        </p>
      )}

      <ol className="flex gap-1" aria-label="Riwayat pesanan">
        <Step label="Dibuat" time={formatDateTime(order.createdAt).split(", ")[1]} state="done" />
        <Step label="Dibayar" state={paid ? "done" : "todo"} />
        {order.manualAt ? (
          <Step label="Manual" time={formatDateTime(order.manualAt).split(", ")[1]} state={manual ? "manual" : "done"} />
        ) : (
          <Step label="Ke supplier" state={failed ? "failed" : order.apiOrderId ? "done" : "todo"} />
        )}
        <Step label="Selesai" time={order.completedAt ? formatDateTime(order.completedAt).split(", ")[1] : undefined} state={order.status === "COMPLETED" ? "done" : "todo"} />
      </ol>

      <div className="flex flex-col gap-2">
        {a && a.kind !== "refund" && (
          <button type="button" disabled={busy} onClick={() => onAction(order, a.kind)} className={`${buttonClass(a.style)} min-h-12 w-full`}>
            {busy
              ? "Memproses..."
              : ({ retry: "Retry fulfillment", confirm: "Konfirmasi pembayaran", complete: "Tandai selesai" } as Record<string, string>)[a.kind] ?? "Cek status pembayaran"}
          </button>
        )}
        {canProcessManually(order) && (
          <button type="button" disabled={busy} onClick={() => onAction(order, "manual")} className={`${buttonClass("secondary")} min-h-12 w-full`}>
            <Hand size={16} aria-hidden="true" /> Proses manual
          </button>
        )}
        {isRejectable(order) && (
          <button type="button" disabled={busy} onClick={() => onAction(order, "refund")} className={`${buttonClass("danger")} min-h-12 w-full`}>
            {isRefundable(order) ? "Refund / Tolak" : "Tolak"}
          </button>
        )}
      </div>
    </Sheet>
  );
}

function ManualSheet({ order, onClose, onDone }: { order: AdminOrder | null; onClose: () => void; onDone: (id: string) => void }) {
  const { addToast } = useToast();
  const [channel, setChannel] = useState<"WHATSAPP" | "EMAIL">("WHATSAPP");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  if (!order) return <Sheet open={false} onClose={onClose} title="" labelId="manual-sheet">{null}</Sheet>;

  async function submit() {
    if (!order) return;
    setBusy(true);
    const data = await fetch("/api/admin/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order.id, action: "START", channel, note: note.trim() || null }),
    })
      .then((r) => r.json())
      .catch(() => ({ success: false, message: "Terjadi kesalahan. Coba lagi." }));
    setBusy(false);
    addToast(data.message ?? (data.success ? "Tersimpan." : "Gagal."), data.success ? "success" : "error");
    if (data.success) onDone(order.id);
  }

  const label = channel === "WHATSAPP" ? "WhatsApp" : "email";
  return (
    <Sheet
      open
      onClose={() => !busy && onClose()}
      labelId="manual-sheet"
      title={`${order.productName} · ${order.variantName}`}
      subtitle={<StatusBadge statusKey={orderStatusKey(order)} />}
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-xl font-bold">Proses pesanan secara manual</h3>
        <p className="text-sm text-muted">Kirim akunnya sendiri ke customer. Customer langsung melihat bahwa pesanannya diproses manual oleh admin.</p>
      </div>
      <div className="flex flex-col gap-2">
        <span id="manual-channel" className="text-[13px] font-semibold">Dikirim lewat</span>
        <div role="group" aria-labelledby="manual-channel" className="grid grid-cols-2 gap-2">
          {([["WHATSAPP", "WhatsApp", MessageCircle], ["EMAIL", "Email", Mail]] as const).map(([id, text, Icon]) => (
            <button key={id} type="button" aria-pressed={channel === id} onClick={() => setChannel(id)} className="kr-chip kr-press min-h-12 gap-2">
              <Icon size={18} aria-hidden="true" /> {text}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="manual-note" className="text-[13px] font-semibold">Catatan untuk customer (opsional)</label>
        <textarea
          id="manual-note"
          rows={3}
          maxLength={300}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Contoh: akun dikirim ke WhatsApp 0812-xxxx dalam 1 jam"
          className="min-h-[88px] resize-none rounded-[14px] border border-hairline bg-surface px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        />
      </div>
      <div className="flex flex-col gap-1 rounded-[18px] bg-card px-4 py-3">
        <span className="text-xs font-semibold text-muted">Yang dilihat customer</span>
        <span className="text-sm">Pesananmu diproses manual oleh admin. Akun akan dikirim lewat {label}.</span>
        {note.trim() && <span className="text-sm text-muted">Catatan admin: {note.trim()}</span>}
      </div>
      <div className="flex flex-col gap-2">
        <button type="button" disabled={busy} onClick={submit} className={`${buttonClass("primary")} min-h-12 w-full`}>
          {busy ? "Memproses..." : "Tandai diproses manual"}
        </button>
        <button type="button" disabled={busy} onClick={onClose} className={`${buttonClass("secondary")} min-h-12 w-full`}>
          Batal
        </button>
      </div>
    </Sheet>
  );
}

export default function OrdersView({ initialFilter }: { initialFilter?: string }) {
  const router = useRouter();
  const { addToast } = useToast();
  const { refresh: refreshSummary } = useAdminSummary();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(filters.some((f) => f.id === initialFilter) ? initialFilter! : "action");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [refundId, setRefundId] = useState<string | null>(null);
  const [manualId, setManualId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/orders")
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) return router.replace("/dashboard");
        const data = await res.json();
        if (cancelled) return;
        if (data.success) setOrders(data.data);
        else setError(data.message ?? "Gagal memuat pesanan.");
      })
      .catch(() => !cancelled && setError("Gagal memuat pesanan."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [router]);

  // Refreshes only the order that changed so memoized rows keep their references.
  const refreshOne = useCallback(async (id: string) => {
    const data = await fetch(`/api/order/${id}`).then((r) => r.json()).catch(() => null);
    if (data?.success) setOrders((prev) => prev.map((o) => (o.id === id ? data.data : o)));
    refreshSummary();
  }, [refreshSummary]);

  const onAction = useCallback(async (order: AdminOrder, kind: ActionKind) => {
    if (kind === "refund") {
      setOpenId(null);
      setRefundId(order.id);
      return;
    }
    if (kind === "manual") {
      setOpenId(null);
      setManualId(order.id);
      return;
    }
    setBusyId(order.id);
    const post = (url: string, body: object) =>
      fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const req =
      kind === "gateway" || kind === "bridge"
        ? fetch(`/api/order/${order.id}/${kind === "gateway" ? "gateway-status" : "bridge-status"}`)
        : kind === "complete"
          ? post("/api/admin/manual", { orderId: order.id, action: "COMPLETE" })
          : post("/api/admin/confirm", { orderId: order.id });
    const data = await req.then((r) => r.json()).catch(() => ({ success: false, message: "Terjadi kesalahan." }));
    const text = kind === "gateway" || kind === "bridge"
      ? data.success ? `Status pembayaran: ${data.data?.status ?? "?"}` : data.message ?? "Gagal cek status."
      : data.message ?? (data.success ? "Berhasil." : "Gagal.");
    addToast(text, data.success ? "success" : "error");
    setBusyId(null);
    await refreshOne(order.id);
  }, [addToast, refreshOne]);

  const counts = useMemo(() => Object.fromEntries(filters.map((f) => [f.id, orders.filter(f.match).length])), [orders]);
  const q = query.trim().toLowerCase();
  const active = filters.find((f) => f.id === filter) ?? filters[0];
  const shown = orders.filter(
    (o) => active.match(o) && (!q || o.id.toLowerCase().includes(q) || o.user.email.toLowerCase().includes(q) || `${o.productName} ${o.variantName}`.toLowerCase().includes(q))
  );
  const openOrder = orders.find((o) => o.id === openId) ?? null;

  return (
    <>
      <AdminHeader title="Pesanan" subtitle={loading ? undefined : `${counts.action} pesanan perlu tindakan`} />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="relative block md:w-[420px]">
          <span className="sr-only">Cari pesanan</span>
          <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari ID, email, atau produk"
            className="kr-field min-h-12 !pl-11"
          />
        </label>
        <div role="group" aria-label="Filter pesanan" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              // Deep links (e.g. ?filter=all) can pick a chip that starts off-screen on phones.
              ref={filter === f.id ? (el) => el?.scrollIntoView({ block: "nearest", inline: "nearest" }) : undefined}
              className={`kr-chip kr-press min-h-11 shrink-0 px-4 ${filter === f.id ? "!bg-ink !text-on-ink" : ""}`}
            >
              {f.label}
              {!loading && f.id !== "all" && counts[f.id] > 0 && <span className="tabular-nums opacity-70">{counts[f.id]}</span>}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3" role="status" aria-label="Memuat pesanan">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-32 w-full" radius="rounded-[24px]" />)}
        </div>
      ) : error ? (
        <div role="alert" className="rounded-[22px] bg-danger-bg px-6 py-4 text-sm font-medium text-danger">{error}</div>
      ) : shown.length === 0 ? (
        <div className="rounded-[24px] bg-surface px-6 py-12 text-center text-sm font-medium text-muted shadow-card">
          {q ? "Tidak ada pesanan yang cocok." : filter === "action" ? "Semua beres. Tidak ada pesanan yang perlu tindakan." : "Tidak ada pesanan."}
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-3 md:hidden">
            {shown.map((o) => <OrderCard key={o.id} order={o} busy={busyId === o.id} onAction={onAction} onOpen={setOpenId} />)}
          </ul>
          <div className="hidden overflow-x-auto rounded-[24px] bg-surface p-2 shadow-card md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-muted">
                  {["Pesanan", "Pembeli", "Metode", "Nominal", "Status", "Umur", "Aksi"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {shown.map((o) => <OrderRow key={o.id} order={o} busy={busyId === o.id} onAction={onAction} onOpen={setOpenId} />)}
              </tbody>
            </table>
          </div>
        </>
      )}

      <OrderSheet key={`order-${openId ?? "none"}`} order={openOrder} busy={busyId === openId} onAction={onAction} onClose={() => setOpenId(null)} />

      <ManualSheet
        key={`manual-${manualId ?? "none"}`}
        order={orders.find((o) => o.id === manualId) ?? null}
        onClose={() => setManualId(null)}
        onDone={(id) => {
          setManualId(null);
          refreshOne(id);
        }}
      />

      <RefundDialog
        key={`refund-${refundId ?? "closed"}`}
        orderId={refundId}
        onClose={() => setRefundId(null)}
        onDone={(r) => {
          addToast(r.text, r.ok ? "success" : "error");
          if (refundId) refreshOne(refundId);
        }}
      />
    </>
  );
}
