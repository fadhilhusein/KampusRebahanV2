import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, message: "Email wajib diisi." }, { status: 400 });
    }

    if (!code || typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ success: false, message: "Kode reset tidak valid." }, { status: 400 });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json({ success: false, message: "Password minimal 8 karakter." }, { status: 400 });
    }

    if (newPassword.length > 128) {
      return NextResponse.json({ success: false, message: "Password terlalu panjang." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return NextResponse.json({ success: false, message: "Kode tidak valid atau sudah kedaluwarsa." }, { status: 400 });
    }

    const token = await prisma.passwordResetToken.findFirst({
      where: { userId: user.id, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!token) {
      return NextResponse.json({ success: false, message: "Kode tidak valid atau sudah kedaluwarsa." }, { status: 400 });
    }

    if (token.attempts >= MAX_ATTEMPTS) {
      await prisma.passwordResetToken.update({ where: { id: token.id }, data: { used: true } });
      return NextResponse.json({ success: false, message: "Terlalu banyak percobaan. Minta kode baru." }, { status: 400 });
    }

    const codeHash = createHash("sha256").update(code).digest("hex");

    if (codeHash !== token.codeHash) {
      await prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { attempts: { increment: 1 } },
      });
      return NextResponse.json({ success: false, message: "Kode salah." }, { status: 400 });
    }

    const hashed = await hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { password: hashed } }),
      prisma.passwordResetToken.update({ where: { id: token.id }, data: { used: true } }),
    ]);

    return NextResponse.json({ success: true, message: "Password berhasil direset." });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
