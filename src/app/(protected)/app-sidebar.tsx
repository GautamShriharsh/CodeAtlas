"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bot,
  ChevronLeft,
  CreditCard,
  LayoutDashboard,
  Menu,
  PanelLeft,
  PanelLeftClose,
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
import useProject from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";


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
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

const AppSideBar = () => {
  const pathname = usePathname();
  const { projects, projectId, setProjectId } = useProject();
  const router = useRouter();
  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader
        className={cn(
          "flex p-2 transition-all duration-200",
          open
            ? "flex-row items-center justify-between"
            : "flex-col items-center justify-center",
        )}
      >
        {open && (
          <div className="animate-in fade-in flex items-center gap-2 duration-200">
            <Image
              src="/chip1.svg"
              alt="Logo"
              width={32}
              height={32}
              className="shrink-0"
            />
            <span className="text-foreground text-lg font-bold tracking-tight">
              CodeAtlas
            </span>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "text-muted-foreground h-7 w-7 transition-colors hover:cursor-pointer hover:text-white",
            !open && "mx-auto",
          )}
        >
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
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
                          "transition-colors hover:text-white",
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
              {projects?.map((project) => {
                const isSelected = project.id === projectId;

                return (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton
                      onClick={() => {
                        setProjectId(project.id);
                        router.push(`${pathname}`);
                      }}
                      className={cn(
                        "transition-colors hover:cursor-pointer",
                        isSelected &&
                          "bg-gray-500/15 font-medium text-white hover:bg-gray-500/20",
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-5 items-center justify-center rounded-md text-[10px] font-semibold",
                          isSelected
                            ? "bg-cyan-500/20 text-white"
                            : "bg-cyan-500/20 text-white",
                        )}
                      >
                        {project.name.charAt(0).toUpperCase()}
                      </div>

                      {open && <span>{project.name}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem>
                <Link href="/create">
                  <SidebarMenuButton className="hover:border-gray-20 border border-dashed border-gray-500/15 hover:cursor-pointer">
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
