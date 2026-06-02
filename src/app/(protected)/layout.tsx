import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import AppSideBar from "./app-sidebar";

type Props = {
  children: React.ReactNode;
};

const SideBarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSideBar />

      <main className="flex-1 m-2 flex flex-col">
        
        {/* Top Navbar */}
        <div className="flex items-center gap-4 border-sidebar-border bg-sidebar border shadow rounded-md p-3 px-4">
          
          {/* Search goes here */}
          <div className="flex-1">
            {/* <SearchBar /> */}
          </div>

          <UserButton />
        </div>

        {/* Page Content */}
        <div className="mt-2 flex-1 border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-auto p-4">
          {children}
        </div>

      </main>
    </SidebarProvider>
  );
};

export default SideBarLayout;