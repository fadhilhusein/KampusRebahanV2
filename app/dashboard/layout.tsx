import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { requireAdmin } from "@/lib/adminAuth";
import DashboardFrame from "@/components/dashboard/DashboardFrame";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin?callbackUrl=%2Fdashboard");

  // Same check the admin APIs enforce, so the menu never shows what the API would refuse.
  const isAdmin = (await requireAdmin()) !== null;

  return (
    <DashboardFrame user={{ name: session.user.name ?? null, email: session.user.email ?? "", isAdmin }}>
      {children}
    </DashboardFrame>
  );
}
