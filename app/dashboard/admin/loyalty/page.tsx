"use client";

import AdminLoyalty from "@/components/dashboard/AdminLoyalty";
import { AdminHeader } from "@/components/admin/AdminShell";

export default function AdminLoyaltyPage() {
  return (
    <>
      <AdminHeader title="Loyalitas" subtitle="Progres kupon Gemini AI Pro dan dampak refund per pelanggan." />
      <AdminLoyalty />
    </>
  );
}
