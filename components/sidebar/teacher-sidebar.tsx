"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconSearch,
  IconSettings,
  IconUsers,
  IconBook,
  IconPlus,
  IconFileText,
  IconUser,
} from "@tabler/icons-react";
import Logo from "@/public/logo.png";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

const teacherData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/teacher",
      icon: IconDashboard,
    },
    {
      title: "Profile",
      url: "/teacher/profile",
      icon: IconUser,
    },
    {
      title: "My Courses",
      url: "/admin/courses",
      icon: IconBook,
    },
    {
      title: "Create Course",
      url: "/admin/courses/create",
      icon: IconPlus,
    },
    {
      title: "Analytics",
      url: "/teacher/analytics",
      icon: IconChartBar,
    },
    {
      title: "Students",
      url: "/teacher/students",
      icon: IconUsers,
    },
    {
      title: "Resources",
      url: "/teacher/resources",
      icon: IconFileText,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/teacher/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/teacher/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function TeacherSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/teacher">
                <Image src={Logo} alt="Logo" className="size-5" />
                <span className="text-base font-semibold">KIDOKOOL.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={teacherData.navMain} />
        <NavSecondary items={teacherData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}