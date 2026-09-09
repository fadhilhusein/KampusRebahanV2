import { NextRequest, NextResponse } from "next/server";
import { createHash, randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendResetCodeEmail } from "@/lib/mailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_MS = 60 * 1000;
const CODE_TTL_MS = 10 * 60 * 1000;

const GENERIC_MESSAGE = "Jika email terdaftar, kode reset telah dikirim.";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ success: false, message: "Format email tidak valid." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (user) {
      const lastToken = await prisma.passwordResetToken.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });

      const withinCooldown =
        lastToken && Date.now() - lastToken.createdAt.getTime() < RESEND_COOLDOWN_MS;

      if (!withinCooldown) {
        const code = randomInt(100000, 1000000).toString();
        const codeHash = createHash("sha256").update(code).digest("hex");

        await prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            codeHash,
            expiresAt: new Date(Date.now() + CODE_TTL_MS),
          },
        });

        await sendResetCodeEmail(user.email, code);
      }
    }

    return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
