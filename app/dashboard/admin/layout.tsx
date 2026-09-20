import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";

// The admin APIs enforce this too; the check here keeps non-admins off the page itself.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await requireAdmin())) redirect("/dashboard");

  return children;
}
