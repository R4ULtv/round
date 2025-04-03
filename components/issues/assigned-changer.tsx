"use client";

import { user as userSchema } from "@/auth-schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateAssignedUser } from "@/server/update-issue";
import { CheckIcon, CircleUserRoundIcon, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AssignedChanger({
  issueId,
  members,
  assignedUser,
}: {
  issueId: string;
  members: (typeof userSchema.$inferSelect)[];
  assignedUser: typeof userSchema.$inferSelect | undefined;
}) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(assignedUser);
  const [open, setOpen] = useState(false);

  const handleSelect = async (
    selectedUser: typeof userSchema.$inferSelect | undefined,
  ) => {
    setSelectedUser(selectedUser);
    setOpen(false);
    try {
      await updateAssignedUser({
        issueId: issueId,
        assignedUserId: selectedUser?.id || null,
      });
      router.refresh();
      toast.success("Assigned User Updated", {
        description: "The issue assigned user has been updated.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update issue", {
        description: "An error occurred while updating the issue.",
      });
      setSelectedUser(assignedUser);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {selectedUser ? (
          <Avatar className="size-5">
            <AvatarImage
              src={selectedUser.image || undefined}
              alt={selectedUser.name}
            />
            <AvatarFallback className="text-xs">
              {selectedUser.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <CircleUserRoundIcon className="size-5 text-muted-foreground" />
        )}
      </PopoverTrigger>
      <PopoverContent className="border w-full min-w-48 p-0" align="end">
        <Command>
          <CommandInput placeholder="Assign user..." />
          <CommandList>
            <CommandGroup>
              <CommandItem
                value={undefined}
                onSelect={() => handleSelect(undefined)}
              >
                <CircleUserRoundIcon className="size-4 stroke-muted-foreground" />
                <span>Unassigned</span>
                {selectedUser === undefined && (
                  <CheckIcon className="size-4 ml-auto" />
                )}
              </CommandItem>
              {members.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="size-4">
                      <AvatarImage src={item.image || ""} alt={item.name} />
                      <AvatarFallback className="text-xs">
                        {item.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{item.name}</span>
                  </div>
                  {selectedUser?.id === item.id && (
                    <CheckIcon className="size-4 ml-auto" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem>
                <SendIcon className="size-4" />
                Invite and assign...
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
