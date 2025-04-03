import * as React from "react";
import { RoundIcon } from "@/lib/icons";
import Link from "next/link";

import { NavMembers } from "@/components/nav/members";
import { NavProjects } from "@/components/nav/projects";
import { NavUser } from "@/components/nav/user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { project as projectSchema, user as userSchema } from "@/auth-schema";

export function AppSidebar({
  projects,
  members,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  projects: (typeof projectSchema.$inferInsert)[];
  members: (typeof userSchema.$inferInsert)[];
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <RoundIcon className="size-5" />
                <span className="text-base font-semibold">
                  Round - Self-Hosted
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMembers members={members} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
