import { NextResponse } from "next/server";
import { isPopupLive } from "@/lib/popup";
import { getPopup } from "@/lib/popupStore";

export async function GET() {
  const p = await getPopup();
  if (!isPopupLive(p)) return NextResponse.json({ success: true, data: null });
  const { type, title, body, image, ctaLabel, ctaHref, frequency, version } = p;
  return NextResponse.json({ success: true, data: { type, title, body, image, ctaLabel, ctaHref, frequency, version } });
}
