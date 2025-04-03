"use client";

import { user as userSchema, project as projectSchema } from "@/auth-schema";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InviteDialog from "@/components/layout/invite-dialog";

export function NavMembers({
  members,
  currentProject,
}: {
  members: (typeof userSchema.$inferInsert)[];
  currentProject: typeof projectSchema.$inferInsert;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Members</SidebarGroupLabel>
      <SidebarMenu>
        {members.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton>
              <Avatar className="size-4">
                <AvatarImage src={item.image || undefined} alt={item.name} />
                <AvatarFallback className="text-xs">
                  {item.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <InviteDialog projectId={currentProject.id} />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
