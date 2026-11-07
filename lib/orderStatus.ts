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
  REFUNDED: "primary",
  EXPIRED: "primary",
};

/** Display key: a rejected order whose money went back shows as "Direfund". */
export const displayStatus = (status: string, refundedAt: string | Date | null | undefined) =>
  status === "REJECTED" && refundedAt ? "REFUNDED" : status;

export const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Bayar",
  PAID: "Menunggu Verifikasi",
  PROCESSING: "Diproses",
  AWAITING_RETRY: "Diproses",
  COMPLETED: "Selesai",
  FAILED: "Gagal",
  REJECTED: "Ditolak",
  REFUNDED: "Direfund",
  EXPIRED: "Kadaluarsa",
};
