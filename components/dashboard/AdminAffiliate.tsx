// Payout labels shared by the user's Affiliate page and the admin Pencairan page.

export const payoutMethodLabel: Record<string, string> = {
  DANA: "DANA",
  OVO: "OVO",
  GOPAY: "GoPay",
  SHOPEEPAY: "ShopeePay",
  BANK: "Bank",
};

export const payoutStatus: Record<string, { label: string; color: "primary" | "secondary" | "tertiary" }> = {
  PENDING: { label: "Menunggu", color: "tertiary" },
  PAID: { label: "Dibayar", color: "secondary" },
  REJECTED: { label: "Ditolak", color: "primary" },
};
