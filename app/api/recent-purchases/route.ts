import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getDisplayName(name: string | null) {
  const trimmed = name?.trim();
  if (!trimmed) return "Pelanggan";

  return trimmed.split(/\s+/)[0] || "Pelanggan";
}

function formatRelativeTime(date: Date) {
  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return "baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam yang lalu`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari yang lalu`;
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ["PENDING_PAYMENT", "PAID", "PROCESSING", "COMPLETED"] },
      },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    const data = orders.map((order) => ({
      id: order.id,
      name: getDisplayName(order.user.name),
      product: order.productName,
      purchasedAt: order.createdAt.toISOString(),
      timeLabel: formatRelativeTime(order.createdAt),
    }));

    return NextResponse.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: String(err), data: [] },
      { status: 500 }
    );
  }
}
