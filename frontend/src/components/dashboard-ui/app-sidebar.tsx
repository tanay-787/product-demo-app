"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Container,
  Code,
  Terminal,
  ChartNoAxesGantt,
  LayoutDashboard,
  ChartColumn,
  Users,
  Folders
} from "lucide-react"

import { NavMain } from '@/components/dashboard-ui/nav-main'
import { NavSecondary } from '@/components/dashboard-ui/nav-secondary'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: ChartNoAxesGantt,
      isActive: true,
    },
    {
      title: "Tours",
      url: "/dashboard/tours",
      icon: Folders,
      isActive: true,
    },
    {
      title: "Insights",
      url: "/dashboard/insights",
      icon: ChartColumn,
    },
    {
      title: "Shared With Me",
      url: "#",
      icon: Users,
    },
  ],
  navSecondary: [
    {
      title: "Docs",
      url: "#",
      icon: BookOpen,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-14 !h-[calc(100svh-56px)]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive size="lg" asChild>
              <div>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Tourify</span>
                </div>
                </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  )
}
