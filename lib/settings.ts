import { prisma } from "@/lib/prisma";

export async function getMarkupPercent(): Promise<number> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "markup_percent" } });
    if (row) return Number(row.value);
  } catch {}
  // fallback to env
  return Number(process.env.MARKUP_PERCENT ?? "0");
}

export async function setMarkupPercent(value: number): Promise<void> {
  await prisma.setting.upsert({
    where: { key: "markup_percent" },
    update: { value: String(value) },
    create: { key: "markup_percent", value: String(value) },
  });
}

export async function isBankTransferEnabled(): Promise<boolean> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "bank_transfer_enabled" } });
    if (row) return row.value === "true";
  } catch {}
  return true;
}

export async function setBankTransferEnabled(enabled: boolean): Promise<void> {
  await prisma.setting.upsert({
    where: { key: "bank_transfer_enabled" },
    update: { value: String(enabled) },
    create: { key: "bank_transfer_enabled", value: String(enabled) },
  });
}

export async function isQrisGatewayEnabled(): Promise<boolean> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "qris_gateway_enabled" } });
    if (row) return row.value === "true";
  } catch {}
  return true;
}

export async function setQrisGatewayEnabled(enabled: boolean): Promise<void> {
  await prisma.setting.upsert({
    where: { key: "qris_gateway_enabled" },
    update: { value: String(enabled) },
    create: { key: "qris_gateway_enabled", value: String(enabled) },
  });
}

async function getNumberSetting(key: string, fallback: number): Promise<number> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    if (row && !isNaN(Number(row.value))) return Number(row.value);
  } catch {}
  return fallback;
}

async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
}

export const getReferralCommissionPercent = () => getNumberSetting("referral_commission_percent", 5);
export const setReferralCommissionPercent = (v: number) => setSetting("referral_commission_percent", String(v));
export const getReferralMinPayout = () => getNumberSetting("referral_min_payout", 50000);
export const setReferralMinPayout = (v: number) => setSetting("referral_min_payout", String(v));

export async function isQrisBridgeEnabled(): Promise<boolean> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "qris_bridge_enabled" } });
    if (row) return row.value === "true";
  } catch {}
  return true;
}

export async function setQrisBridgeEnabled(enabled: boolean): Promise<void> {
  await prisma.setting.upsert({
    where: { key: "qris_bridge_enabled" },
    update: { value: String(enabled) },
    create: { key: "qris_bridge_enabled", value: String(enabled) },
  });
}

// Top up QRIS providers, toggled separately from product checkout.
// Bridge starts off so existing behaviour (Bayar.gg only) holds until admin enables it.
async function getBoolSetting(key: string, fallback: boolean): Promise<boolean> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    if (row) return row.value === "true";
  } catch {}
  return fallback;
}

export const isTopupQrisGatewayEnabled = () => getBoolSetting("topup_qris_gateway_enabled", true);
export const setTopupQrisGatewayEnabled = (v: boolean) => setSetting("topup_qris_gateway_enabled", String(v));
export const isTopupQrisBridgeEnabled = () => getBoolSetting("topup_qris_bridge_enabled", false);
export const setTopupQrisBridgeEnabled = (v: boolean) => setSetting("topup_qris_bridge_enabled", String(v));
