import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "./app-sidebar";
import { DashboardHeader } from "./dashboard-header";

type Props = {
  children: React.ReactNode;
};

const SideBarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSideBar />

      <main className="flex flex-1 flex-col overflow-hidden p-2 pl-0">
        {/* Top Navbar Header Container */}
        <DashboardHeader />

        {/* Page Content Container Box */}
        <div className="border-sidebar-border bg-sidebar flex-1 overflow-y-auto rounded-b-md border p-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SideBarLayout;
