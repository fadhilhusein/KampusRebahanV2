"use client";

import { createContext, useContext } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export type SidebarUser = { name: string | null; email: string; isAdmin: boolean };

const DashboardUserContext = createContext<SidebarUser | null>(null);

export function useDashboardUser() {
  const user = useContext(DashboardUserContext);
  if (!user) throw new Error("useDashboardUser must be used inside DashboardFrame");
  return user;
}

export default function DashboardFrame({ user, children }: { user: SidebarUser; children: React.ReactNode }) {
  return (
    <DashboardUserContext.Provider value={user}>
      <div className="kr-page">
        <Navbar />
        <main className="flex w-full min-w-0 flex-1 flex-col gap-6 py-8 md:gap-10 md:py-10">{children}</main>
        <Footer />
      </div>
    </DashboardUserContext.Provider>
  );
}
