import { auth } from "@/auth";

export async function requireAdmin(): Promise<{ userId: string; email: string } | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  if (!adminEmails.includes(email.toLowerCase())) return null;

  const userId = (session?.user as { id?: string })?.id ?? "";
  return { userId, email };
}
