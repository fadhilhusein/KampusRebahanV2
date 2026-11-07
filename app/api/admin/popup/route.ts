import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { parsePopup } from "@/lib/popup";
import { getPopup, setPopup } from "@/lib/popupStore";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  return NextResponse.json({ success: true, data: await getPopup() });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const parsed = parsePopup(await req.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ success: false, message: parsed.error }, { status: 400 });

  const data = await setPopup(parsed.value);
  return NextResponse.json({
    success: true,
    message: data.enabled ? "Popup disimpan dan aktif." : "Popup disimpan, tapi masih nonaktif dan tidak tampil di landing.",
    data,
  });
}
