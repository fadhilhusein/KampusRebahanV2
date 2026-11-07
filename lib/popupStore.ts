import { prisma } from "@/lib/prisma";
import { emptyPopup, type PopupConfig } from "@/lib/popup";

const KEY = "landing_popup";

export async function getPopup(): Promise<PopupConfig> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: KEY } });
    if (row) return { ...emptyPopup, ...JSON.parse(row.value), version: row.updatedAt.toISOString() };
  } catch {}
  return emptyPopup;
}

export async function setPopup(value: Omit<PopupConfig, "version">): Promise<PopupConfig> {
  const json = JSON.stringify(value);
  const row = await prisma.setting.upsert({ where: { key: KEY }, update: { value: json }, create: { key: KEY, value: json } });
  return { ...value, version: row.updatedAt.toISOString() };
}
