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
