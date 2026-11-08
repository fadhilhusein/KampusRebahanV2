"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { DashboardBottomBar, DashboardSidebar } from "@/components/dashboard/DashboardNav";

export type SidebarUser = { name: string | null; email: string; isAdmin: boolean };

const DashboardUserContext = createContext<SidebarUser | null>(null);

export function useDashboardUser() {
  const user = useContext(DashboardUserContext);
  if (!user) throw new Error("useDashboardUser must be used inside DashboardFrame");
  return user;
}

export default function DashboardFrame({ user, children }: { user: SidebarUser; children: React.ReactNode }) {
  // The admin area keeps its own shell (AdminShell + its bottom bar), so it gets the plain frame.
  const isAdminArea = usePathname().startsWith("/dashboard/admin");

  if (isAdminArea)
    return (
      <DashboardUserContext.Provider value={user}>
        <div className="kr-page lg:max-w-[1600px] lg:px-10 xl:px-14">
          <Navbar />
          <main className="flex w-full min-w-0 flex-1 flex-col gap-6 py-8 md:gap-10 md:py-10">{children}</main>
          <Footer />
        </div>
      </DashboardUserContext.Provider>
    );

  return (
    <DashboardUserContext.Provider value={user}>
      <div className="lg:flex">
        <DashboardSidebar user={user} />
        {/* Bottom padding below lg leaves room for the fixed bottom bar. */}
        <div className="kr-page min-w-0 flex-1 max-lg:pb-28 lg:max-w-[1336px] lg:px-14 lg:pt-8 xl:px-16">
          <div className="lg:hidden">
            <Navbar />
          </div>
          <main className="flex w-full min-w-0 flex-1 flex-col gap-6 py-8 md:gap-10 md:py-10">{children}</main>
          <Footer />
        </div>
      </div>
      <DashboardBottomBar isAdmin={user.isAdmin} />
    </DashboardUserContext.Provider>
  );
}
