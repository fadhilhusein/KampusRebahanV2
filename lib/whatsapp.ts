// Store-owner WhatsApp alerts through a self-hosted OpenWA gateway.
// POST {OPENWA_URL}/api/sessions/{OPENWA_SESSION_ID}/messages/send-text, header X-API-Key,
// body { chatId: "628…@c.us", text }. All four OPENWA_* env vars must be set, or nothing is sent.

/** "0851…", "+62 851-…", "62851…" or an existing "…@c.us" → "62851…@c.us". */
export function toChatId(number: string): string | null {
  const raw = number.trim();
  if (/@(c|g)\.us$/.test(raw)) return raw;
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "62" + digits.slice(1);
  return digits.length >= 10 && digits.length <= 15 ? `${digits}@c.us` : null;
}

const PAYMENT_LABEL: Record<string, string> = {
  QRIS_BRIDGE: "QRIS Instan",
  QRIS_GATEWAY: "QRIS Bayar.gg",
  BANK_TRANSFER: "Transfer bank",
  BALANCE: "Saldo",
  REFERRAL_BALANCE: "Saldo referensi",
  COUPON: "Kupon",
};

export interface OrderAlert {
  id: string;
  productName: string;
  variantName: string;
  quantity: number;
  sellPrice: number;
  costPrice: number;
  paymentMethod: string;
  buyer: string;
}

/** Order row (with its buyer) → the fields an alert shows. */
export function orderAlert(o: Omit<OrderAlert, "buyer"> & { user: { name: string | null; email: string } }): OrderAlert {
  const buyer = o.user.name ? `${o.user.name} (${o.user.email})` : o.user.email;
  return { id: o.id, productName: o.productName, variantName: o.variantName, quantity: o.quantity, sellPrice: o.sellPrice, costPrice: o.costPrice, paymentMethod: o.paymentMethod, buyer };
}

const rp = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
const adminLink = () => {
  const appUrl = (process.env.APP_URL || "").replace(/\/$/, "");
  return appUrl ? `\n${appUrl}/dashboard/admin/orders` : "";
};

export function paidOrderText(o: OrderAlert, status: string): string {
  return [
    "*Pesanan baru dibayar*",
    `Produk: ${o.productName} - ${o.variantName} (${o.quantity}x)`,
    `Pembeli: ${o.buyer}`,
    `Dibayar: ${rp(o.sellPrice)} via ${PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod}`,
    `Profit: ${rp(o.sellPrice - o.costPrice)}`,
    `Status: ${status}`,
    `ID: ${o.id}`,
  ].join("\n") + adminLink();
}

export function completedOrderText(o: OrderAlert): string {
  return [
    "*Pesanan selesai diproses*",
    `Produk: ${o.productName} - ${o.variantName} (${o.quantity}x)`,
    `Pembeli: ${o.buyer}`,
    `Total: ${rp(o.sellPrice)}`,
    `ID: ${o.id}`,
  ].join("\n") + adminLink();
}

/**
 * Sends `text` to every number in OPENWA_NOTIFY_TO (comma-separated). Never throws: a gateway
 * problem must not block an order. `dedupeKey` becomes the Idempotency-Key so a retried call
 * can't send the same alert twice.
 */
export async function sendOwnerWhatsApp(text: string, dedupeKey: string): Promise<void> {
  const { OPENWA_URL, OPENWA_API_KEY, OPENWA_SESSION_ID, OPENWA_NOTIFY_TO } = process.env;
  if (!OPENWA_URL || !OPENWA_API_KEY || !OPENWA_SESSION_ID || !OPENWA_NOTIFY_TO) return;

  const url = `${OPENWA_URL.replace(/\/$/, "")}/api/sessions/${encodeURIComponent(OPENWA_SESSION_ID)}/messages/send-text`;
  const chatIds = OPENWA_NOTIFY_TO.split(",").map(toChatId).filter((c): c is string => !!c);

  await Promise.all(
    chatIds.map(async (chatId) => {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-API-Key": OPENWA_API_KEY, "Idempotency-Key": `${dedupeKey}:${chatId}` },
          body: JSON.stringify({ chatId, text }),
          signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) console.error("OpenWA send failed", res.status, dedupeKey, (await res.text().catch(() => "")).slice(0, 300));
      } catch (err) {
        console.error("OpenWA send failed", dedupeKey, err);
      }
    })
  );
}
