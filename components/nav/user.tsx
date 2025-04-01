"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavUser() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isPending ? (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="grid flex-1 gap-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            ) : (
              user && (
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto size-4" />
                </SidebarMenuButton>
              )
            )}
          </DropdownMenuTrigger>
          {user && (
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() =>
                  signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/login");
                      },
                    },
                  })
                }
              >
                <LogOutIcon className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
