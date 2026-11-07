// Landing info popup: shape, validation and visibility rules. No DB access here so it stays testable.

export type PopupType = "info" | "promo" | "warning";
export type PopupFrequency = "once" | "session";

export interface PopupConfig {
  enabled: boolean;
  type: PopupType;
  title: string;
  body: string;
  /** data URL (uploaded in admin) or empty */
  image: string;
  ctaLabel: string;
  ctaHref: string;
  frequency: PopupFrequency;
  /** YYYY-MM-DD or empty */
  startDate: string;
  endDate: string;
  /** changes on every save; visitors who dismissed an older version see the new one */
  version: string;
}

export const POPUP_TITLE_MAX = 80;
export const POPUP_BODY_MAX = 240;
// shortcut: banner lives inside the Setting row as a data URL, move to object storage if banners need to be bigger
export const POPUP_IMAGE_MAX_BYTES = 300 * 1024;

export const emptyPopup: PopupConfig = {
  enabled: false,
  type: "info",
  title: "",
  body: "",
  image: "",
  ctaLabel: "",
  ctaHref: "",
  frequency: "once",
  startDate: "",
  endDate: "",
  version: "",
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const IMAGE_RE = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Validates admin input. Returns the cleaned config or an error message in Indonesian. */
export function parsePopup(input: unknown): { ok: true; value: Omit<PopupConfig, "version"> } | { ok: false; error: string } {
  const b = (input ?? {}) as Record<string, unknown>;
  const type: PopupType = b.type === "promo" || b.type === "warning" ? b.type : "info";
  const frequency: PopupFrequency = b.frequency === "session" ? "session" : "once";
  const title = str(b.title, POPUP_TITLE_MAX + 1);
  const body = str(b.body, POPUP_BODY_MAX + 1);
  const ctaLabel = str(b.ctaLabel, 40);
  const ctaHref = str(b.ctaHref, 300);
  const image = typeof b.image === "string" ? b.image : "";
  const startDate = str(b.startDate, 10);
  const endDate = str(b.endDate, 10);
  const enabled = b.enabled === true;

  if (enabled && !title) return { ok: false, error: "Judul wajib diisi sebelum popup diaktifkan." };
  if (title.length > POPUP_TITLE_MAX) return { ok: false, error: `Judul maksimal ${POPUP_TITLE_MAX} karakter.` };
  if (body.length > POPUP_BODY_MAX) return { ok: false, error: `Isi pesan maksimal ${POPUP_BODY_MAX} karakter.` };
  if (ctaLabel && !ctaHref) return { ok: false, error: "Link tombol wajib diisi kalau teks tombol diisi." };
  // Only internal paths or https links: blocks javascript: and other schemes.
  if (ctaHref && !(/^\/(?!\/)/.test(ctaHref) || /^https:\/\/[^\s]+$/.test(ctaHref)))
    return { ok: false, error: "Link tombol harus diawali / atau https://." };
  if (image && !IMAGE_RE.test(image)) return { ok: false, error: "Banner harus gambar PNG, JPG, atau WebP." };
  // base64 is ~4/3 of the file size
  if (image.length * 0.75 > POPUP_IMAGE_MAX_BYTES) return { ok: false, error: "Ukuran banner maksimal 300 KB." };
  if ((startDate && !DATE_RE.test(startDate)) || (endDate && !DATE_RE.test(endDate)))
    return { ok: false, error: "Format tanggal tidak valid." };
  if (startDate && endDate && endDate < startDate) return { ok: false, error: "Tanggal selesai harus setelah tanggal mulai." };

  return { ok: true, value: { enabled, type, title, body, image, ctaLabel: ctaHref ? ctaLabel || "Lihat" : "", ctaHref, frequency, startDate, endDate } };
}

/** Today's date in WIB as YYYY-MM-DD, matching the dates the admin picks. */
export function todayWib(now = new Date()): string {
  return new Date(now.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
}

/** Whether visitors should see the popup right now. Dates are inclusive. */
export function isPopupLive(p: PopupConfig, today = todayWib()): boolean {
  if (!p.enabled || !p.title) return false;
  if (p.startDate && today < p.startDate) return false;
  if (p.endDate && today > p.endDate) return false;
  return true;
}
