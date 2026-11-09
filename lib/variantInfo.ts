import { parseWarrantyDays } from "@/lib/refundCalc";

/** What a buyer must know about a variant, read from supplier data (shown before buying and after). */
export type InfoIcon = "shield-check" | "shield-off" | "calendar-clock" | "zap" | "users" | "lock" | "user-plus" | "key" | "receipt";
export type InfoTone = "warn" | "success" | "neutral";
export interface InfoPoint {
  key: "warranty" | "delivery" | "type" | "refund";
  icon: InfoIcon;
  title: string;
  desc: string;
  tone: InfoTone;
}

type VariantLike = { name: string; type: string; warranty: string | null | undefined };

const MONTHS = "januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember";
const RANGE = new RegExp(`(\\d{1,2})(?:\\s*[-–]\\s*(\\d{1,2}))?\\s+(${MONTHS})`, "i");

/** Risk flags. PO shows in the variant name, e.g. "(PO)" or "13 - 16 November". */
export function variantFlags(v: VariantLike) {
  const warrantyDays = parseWarrantyDays(v.warranty);
  const m = v.name.match(RANGE);
  const poDate = m ? `${m[1]}${m[2] ? `–${m[2]}` : ""} ${m[3][0].toUpperCase()}${m[3].slice(1).toLowerCase()}` : null;
  const type = v.type.toLowerCase();
  return {
    warrantyDays,
    noWarranty: warrantyDays === null,
    sharing: type.startsWith("sharing"),
    po: Boolean(poDate) || /\bPO\b/i.test(v.name),
    poDate,
    type,
  };
}

function typePoint(v: VariantLike, type: string): InfoPoint {
  if (type.startsWith("sharing"))
    return { key: "type", icon: "users", tone: "warn", title: "Sharing: akun dipakai bersama", desc: "Kamu dapat 1 slot atau profil. Jangan ubah email, password, atau profil pengguna lain." };
  if (type.startsWith("private"))
    return { key: "type", icon: "lock", tone: "neutral", title: "Private: akun khusus kamu", desc: "Hanya kamu yang memakai akun ini. Tetap ikuti syarat produk di bawah." };
  if (type.startsWith("invite"))
    return { key: "type", icon: "user-plus", tone: "neutral", title: "Invite: diundang ke email kamu", desc: "Undangan dikirim ke email yang kamu isi saat checkout, jadi pastikan emailnya benar." };
  return { key: "type", icon: "key", tone: "neutral", title: `Tipe ${v.type}`, desc: "Cara pakai dan aktivasinya ada di syarat produk." };
}

export function variantPoints(v: VariantLike): InfoPoint[] {
  const f = variantFlags(v);
  return [
    f.noWarranty
      ? { key: "warranty", icon: "shield-off", tone: "warn", title: "Tanpa garansi", desc: "Akun yang bermasalah setelah dikirim tidak diganti." }
      : { key: "warranty", icon: "shield-check", tone: "success", title: `Garansi ${f.warrantyDays} hari`, desc: "Akun error diperbaiki atau diganti selama masa garansi. Garansi bukan pengembalian uang." },
    f.po
      ? { key: "delivery", icon: "calendar-clock", tone: "warn", title: f.poDate ? `Dikirim PO, estimasi ${f.poDate}` : "Dikirim PO, bukan instan", desc: "Kredensial muncul di halaman pesanan dan dikirim ke email begitu stok tiba." }
      : { key: "delivery", icon: "zap", tone: "neutral", title: "Dikirim otomatis", desc: "Kredensial muncul di halaman pesanan begitu pembayaran terdeteksi." },
    typePoint(v, f.type),
    f.noWarranty
      ? { key: "refund", icon: "receipt", tone: "neutral", title: "Refund hanya jika belum terkirim", desc: "Akun yang belum terkirim setelah 48 jam bisa di-refund. Setelah terkirim, tidak ada refund." }
      : { key: "refund", icon: "receipt", tone: "neutral", title: "Refund dihitung dari sisa garansi", desc: "Harga × sisa/masa garansi × 90% − biaya operasional, jika masalah tidak selesai lewat garansi. Belum terkirim setelah 48 jam juga bisa refund." },
  ];
}

/** Checkout consent line, specific to the variant instead of a generic "I agree". */
export function consentText(productName: string, v: VariantLike): string {
  const f = variantFlags(v);
  const parts = [
    f.noWarranty ? "tanpa garansi" : `bergaransi ${f.warrantyDays} hari berupa perbaikan atau ganti akun, bukan uang`,
    ...(f.sharing ? ["dipakai bersama pengguna lain"] : []),
    f.po ? (f.poDate ? `dikirim PO dengan estimasi ${f.poDate}` : "dikirim PO, bukan instan") : "dikirim otomatis",
  ];
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(", ")}, dan ${parts[parts.length - 1]}` : parts[0];
  return `Saya paham ${productName} · ${v.name} ini ${list}. Refund mengikuti S&K bagian 6.`;
}
