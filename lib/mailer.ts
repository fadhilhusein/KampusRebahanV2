import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Store owner inbox for order alerts: ADMIN_NOTIFY_EMAIL, else the first ADMIN_EMAILS entry. */
export function adminNotifyEmail(): string | null {
  return process.env.ADMIN_NOTIFY_EMAIL?.trim() || process.env.ADMIN_EMAILS?.split(",")[0]?.trim() || null;
}

export interface PaidOrderInfo {
  id: string;
  productName: string;
  variantName: string;
  quantity: number;
  sellPrice: number;
  costPrice: number;
  paymentMethod: string;
  buyer: string;
  status: string;
  note?: string;
}

/** Tells the store owner a customer has paid. Never throws: a mail problem must not block the order. */
export async function sendPaidOrderEmail(order: PaidOrderInfo): Promise<void> {
  const to = adminNotifyEmail();
  if (!to || !process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;

  const rp = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
  const appUrl = (process.env.APP_URL || "").replace(/\/$/, "");
  const rows: [string, string][] = [
    ["Produk", `${order.productName} - ${order.variantName} (${order.quantity}x)`],
    ["Pembeli", order.buyer],
    ["Dibayar", `${rp(order.sellPrice)} via ${order.paymentMethod}`],
    ["Modal / profit", `${rp(order.costPrice)} / ${rp(order.sellPrice - order.costPrice)}`],
    ["Status", order.status],
    ["ID pesanan", order.id],
    ...(order.note ? ([["Catatan", order.note]] as [string, string][]) : []),
  ];

  try {
    await transporter.sendMail({
      from: `KampusRebahan <${process.env.GMAIL_USER}>`,
      to,
      subject: `Pesanan dibayar: ${order.productName} ${rp(order.sellPrice)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
          <h2 style="margin: 0 0 12px;">Pesanan baru sudah dibayar</h2>
          <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
            ${rows.map(([k, v]) => `<tr><td style="padding: 6px 12px 6px 0; color: #666; white-space: nowrap;">${k}</td><td style="padding: 6px 0;">${escapeHtml(v)}</td></tr>`).join("")}
          </table>
          ${appUrl ? `<p style="margin-top: 16px;"><a href="${appUrl}/dashboard/admin">Buka dashboard admin</a></p>` : ""}
        </div>
      `,
    });
  } catch (err) {
    console.error("sendPaidOrderEmail failed", order.id, err);
  }
}

export async function sendResetCodeEmail(to: string, code: string) {
  await transporter.sendMail({
    from: `KampusRebahan <${process.env.GMAIL_USER}>`,
    to,
    subject: "Kode Reset Password KampusRebahan",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #E11D48;">Reset Password</h2>
        <p>Gunakan kode berikut untuk mereset password akun KampusRebahan kamu:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; background: #f4f4f4; padding: 16px 24px; text-align: center; border-radius: 4px; margin: 16px 0;">
          ${code}
        </div>
        <p style="color: #666; font-size: 13px;">Kode berlaku selama 10 menit. Jika kamu tidak meminta reset password, abaikan email ini.</p>
      </div>
    `,
  });
}
