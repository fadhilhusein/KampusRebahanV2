import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendResetCodeEmail(to: string, code: string) {
  await transporter.sendMail({
    from: `KampusRebahan <${process.env.GMAIL_USER}>`,
    to,
    subject: "Kode Reset Password KampusRebahan",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #E11D48;">Reset Password</h2>
        <p>Gunakan kode berikut untuk mereset password akun KampusRebahan kamu:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; background: #f4f4f4; padding: 16px 24px; text-align: center; border-radius: 4px; margin: 16px 0;">
          ${code}
        </div>
        <p style="color: #666; font-size: 13px;">Kode berlaku selama 10 menit. Jika kamu tidak meminta reset password, abaikan email ini.</p>
      </div>
    `,
  });
}
