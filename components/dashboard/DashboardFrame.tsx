"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { History, Home, LayoutDashboard, LogOut, ShieldCheck, Store, Wallet } from "lucide-react";
import DashboardShell from "@/components/ui/dashboard-sidebar";
import type { NavGroupData, NavItemData, SidebarUser } from "@/components/ui/dashboard-sidebar";

export default function DashboardFrame({ user, children }: { user: SidebarUser; children: React.ReactNode }) {
  const router = useRouter();

  const groups = useMemo<NavGroupData[]>(() => {
    const result: NavGroupData[] = [
      { items: [{ id: "home", title: "Ringkasan", icon: LayoutDashboard, href: "/dashboard" }] },
      {
        heading: "Akun",
        items: [
          { id: "transactions", title: "Transaksi", icon: History, href: "/dashboard/transactions" },
          { id: "balance", title: "Saldo", icon: Wallet, href: "/dashboard/balance" },
          { id: "products", title: "Produk", icon: Store, href: "/products" },
        ],
      },
    ];
    if (user.isAdmin) {
      result.push({
        heading: "Admin",
        items: [{ id: "admin-orders", title: "Kelola Order", icon: ShieldCheck, href: "/dashboard/admin" }],
      });
    }
    return result;
  }, [user.isAdmin]);

  const bottomItems = useMemo<NavItemData[]>(
    () => [
      { id: "site", title: "Ke Beranda", icon: Home, href: "/" },
      {
        id: "logout",
        title: "Keluar",
        icon: LogOut,
        tone: "danger",
        onClick: async () => {
          await signOut({ redirect: false });
          router.push("/");
          router.refresh();
        },
      },
    ],
    [router]
  );

  return (
    <DashboardShell groups={groups} bottomItems={bottomItems} user={user}>
      {children}
    </DashboardShell>
  );
}
