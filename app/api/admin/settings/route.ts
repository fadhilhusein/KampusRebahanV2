import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getMarkupPercent, setMarkupPercent } from "@/lib/settings";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const markup = await getMarkupPercent();
  return NextResponse.json({ success: true, data: { markup_percent: markup } });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const value = Number(body.markup_percent);

  if (isNaN(value) || value < 0 || value > 1000) {
    return NextResponse.json({ success: false, message: "Nilai markup tidak valid (0–1000)." }, { status: 400 });
  }

  await setMarkupPercent(value);
  return NextResponse.json({ success: true, message: `Markup diupdate ke ${value}%` });
}
