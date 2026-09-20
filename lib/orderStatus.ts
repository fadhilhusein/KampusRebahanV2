export type StatusColor = "primary" | "secondary" | "tertiary" | "default";

// User-facing order status presentation, shared by the dashboard pages.
export const statusColor: Record<string, StatusColor> = {
  PENDING_PAYMENT: "tertiary",
  PAID: "secondary",
  PROCESSING: "tertiary",
  AWAITING_RETRY: "tertiary",
  COMPLETED: "secondary",
  FAILED: "primary",
  REJECTED: "primary",
  EXPIRED: "primary",
};

export const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Bayar",
  PAID: "Menunggu Verifikasi",
  PROCESSING: "Diproses",
  AWAITING_RETRY: "Diproses",
  COMPLETED: "Selesai",
  FAILED: "Gagal",
  REJECTED: "Ditolak",
  EXPIRED: "Kadaluarsa",
};
