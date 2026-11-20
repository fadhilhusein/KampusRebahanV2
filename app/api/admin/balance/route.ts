import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { creditWallet } from "@/lib/referral";

// Sanity cap so a mistyped zero can't credit an absurd amount.
const MAX_AMOUNT = 10_000_000;

/** Users matching ?q= (email or name); the newest users when q is empty. */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 100);
  const users = await prisma.user.findMany({
    where: q
      ? { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, name: true, email: true, balance: true },
  });
  return NextResponse.json({ success: true, data: users });
}

/** Adds money to a user's main balance and logs it as an ADJUSTMENT in their history. */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const { userId, amount, note } = await req.json().catch(() => ({}));
  if (typeof userId !== "string" || !userId) {
    return NextResponse.json({ success: false, message: "Pilih pengguna dulu." }, { status: 400 });
  }
  if (!Number.isInteger(amount) || amount < 1 || amount > MAX_AMOUNT) {
    return NextResponse.json({ success: false, message: `Nominal harus bilangan bulat 1 sampai ${MAX_AMOUNT.toLocaleString("id-ID")}.` }, { status: 400 });
  }
  if (note != null && (typeof note !== "string" || note.length > 300)) {
    return NextResponse.json({ success: false, message: "Catatan maksimal 300 karakter." }, { status: 400 });
  }

  try {
    const balanceAfter = await prisma.$transaction(async (tx) => {
      const after = await creditWallet(tx, userId, "MAIN", amount);
      await tx.balanceTransaction.create({
        data: { userId, type: "ADJUSTMENT", amount, balanceAfter: after, note: note?.trim() || "Saldo ditambahkan admin" },
      });
      return after;
    });
    console.info(`[admin-balance] ${admin.email} credited ${amount} to ${userId}`);
    return NextResponse.json({ success: true, message: "Saldo berhasil ditambahkan.", data: { balance: balanceAfter } });
  } catch (err) {
    // P2025: creditWallet's update found no such user.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ success: false, message: "Pengguna tidak ditemukan." }, { status: 404 });
    }
    throw err;
  }
}
