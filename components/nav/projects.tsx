import { MoreHorizontalIcon } from "lucide-react";

import { project as projectSchema } from "@/auth-schema";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import DynamicIcon from "../dynamic-icon";

export function NavProjects({
  projects,
}: {
  projects: (typeof projectSchema.$inferInsert)[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={`/dashboard/${item.id}`}>
                {item.icon && (
                  <div className="bg-sidebar-accent rounded-sm p-1 border border-border">
                    <DynamicIcon name={item.icon} className="size-3" />
                  </div>
                )}
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="text-sidebar-foreground/70">
            <Link href="/dashboard">
              <MoreHorizontalIcon className="text-sidebar-foreground/70" />
              <span>More</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
