"use client";

import { SendIcon } from "lucide-react";
import { user as userSchema } from "@/auth-schema";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavMembers({
  members,
}: {
  members: (typeof userSchema.$inferInsert)[];
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
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <SendIcon className="text-sidebar-foreground/70" />
            <span>Invite to collaborate...</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
