"use client";

import React from "react";
import { usePathname } from "next/navigation";
import useProject from "@/hooks/use-projects";
import { UserButton } from "@clerk/nextjs";
import { Coins, ChevronRight, Folder, Loader2 } from "lucide-react";
import useCredits from "@/hooks/use-credits";

export const DashboardHeader = () => {
  const pathname = usePathname();
  const { project } = useProject();
  const {credits, isLoading: isCreditLoading} = useCredits();

  const pathSegments = pathname.split("/").filter(Boolean);
  const activeProjectName = project ? project.name : "Select Project";
  const isBillingPage = pathSegments.includes("billing");
  const isCreatePage = pathSegments.includes("create")

  return (
    <div className="flex items-center justify-between border-sidebar-border bg-sidebar border shadow rounded-t-md p-3 px-4">
      
      {/* LEFT SIDE:  Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-medium">
        {project && !isBillingPage && !isCreatePage &&(
          <>
            <div className="flex items-center gap-1.5 text-sidebar-foreground/70">
              <Folder className="h-3.5 w-3.5 text-sidebar-foreground/40" />
              <span className="max-w-[160px] cursor-pointer truncate hover:text-sidebar-foreground transition-colors">
                {activeProjectName}
              </span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground/30" />
          </>
        )}
        
       { !isBillingPage && 
        <span className="text-sidebar-foreground/70 capitalize">
          {pathSegments[pathSegments.length - 1] || "Dashboard"}
        </span>}
      </div>

      {/* RIGHT SIDE: Token Badge + Profile Action */}
      <div className="flex items-center gap-4">
        {/* Live Token/Credit Tracker Pill */}
       {!isBillingPage && (
          <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-background/40 px-3 py-1.5 text-xs font-medium text-sidebar-foreground/80 min-w-[140px] justify-center">
            <Coins className="h-3.5 w-3.5 text-sidebar-foreground/50" />
            
            {/* Dynamic Loader Check */}
            {isCreditLoading ? (
              <div className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin text-sidebar-foreground/40" />
                <span className="text-sidebar-foreground/40 text-[11px]">Loading...</span>
              </div>
            ) : (
              <span>
                <strong className="font-semibold text-sidebar-foreground">
                  {credits ?? 0}
                </strong>{" "}
                credits remaining
              </span>
            )}
          </div>
        )}

        {/* User Profile Avatar Frame */}
        <div className="flex items-center justify-center border-l border-sidebar-border pl-4">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 rounded-full border border-sidebar-border shadow-sm",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};