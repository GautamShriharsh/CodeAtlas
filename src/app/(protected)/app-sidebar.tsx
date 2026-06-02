"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CreditCard,
  LayoutDashboard,
  Plus,
  Presentation,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

const projects = [
  "AI Meeting Assistant",
  "Customer Support Bot",
  "Sales Dashboard",
  "Research Notes",
];

const AppSideBar = () => {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src="/chip1.svg" alt="Logo" width={38} height={38} />
          {open && <span className="text-lg font-bold">CodeAtlas</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "transition-colors",
                          isActive &&
                            "bg-gray-500/15 font-medium text-white hover:bg-gray-500/20",
                        )}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {projects.map((project) => (
                <SidebarMenuItem key={project}>
                  <SidebarMenuButton>
                    <div className="flex size-5 items-center justify-center rounded-md bg-cyan-500/20 text-[10px] font-semibold text-cyan-400">
                      {project.charAt(0).toUpperCase()}
                    </div>

                    {open && <span>{project}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <Link href="/create">
                  <SidebarMenuButton className="hover:border-gray-20 border border-dashed border-gray-500/15">
                    <Plus className="h-4 w-4" />
                    {open && <span>Create Project</span>}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSideBar;
