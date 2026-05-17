import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email dan password wajib diisi." }, { status: 400 });
    }

    if (typeof email !== "string" || !EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json({ success: false, message: "Format email tidak valid." }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ success: false, message: "Password minimal 8 karakter." }, { status: 400 });
    }

    if (password.length > 128) {
      return NextResponse.json({ success: false, message: "Password terlalu panjang." }, { status: 400 });
    }

    if (name && (typeof name !== "string" || name.length > 100)) {
      return NextResponse.json({ success: false, message: "Nama terlalu panjang." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ success: false, message: "Email sudah terdaftar." }, { status: 409 });
    }

    const hashed = await hash(password, 12);
    const user = await prisma.user.create({
      data: { name: name?.trim() || null, email: email.toLowerCase(), password: hashed },
    });

    return NextResponse.json({ success: true, message: "Akun berhasil dibuat.", data: { id: user.id, email: user.email } });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
