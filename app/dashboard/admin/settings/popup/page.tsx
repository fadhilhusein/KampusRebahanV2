"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminPopupSettings from "@/components/dashboard/AdminPopupSettings";
import { AdminHeader } from "@/components/admin/AdminShell";

export default function AdminPopupPage() {
  return (
    <>
      <AdminHeader title="Popup informasi" subtitle="Popup yang tampil di beranda situs." />
      <Link href="/dashboard/admin/settings" className="kr-press inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft size={16} aria-hidden="true" /> Kembali ke Pengaturan
      </Link>
      <AdminPopupSettings />
    </>
  );
}
