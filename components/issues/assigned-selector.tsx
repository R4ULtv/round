import { user as userSchema } from "@/auth-schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { CheckIcon, CircleUserRoundIcon, SendIcon } from "lucide-react";
import { useState } from "react";

export default function AssignedSelector({
  members,
  assignedUser,
  setAssignedUser,
}: {
  members: (typeof userSchema.$inferSelect)[];
  assignedUser: typeof userSchema.$inferSelect | undefined;
  setAssignedUser: (
    assignedUser: typeof userSchema.$inferSelect | undefined,
  ) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (
    assignedUser: typeof userSchema.$inferSelect | undefined,
  ) => {
    setAssignedUser(assignedUser);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="flex items-center justify-center m-0 h-7 rounded-sm px-2.5"
          variant="outline"
          size="sm"
          role="combobox"
        >
          {assignedUser ? (
            <>
              <Avatar className="size-3.5">
                <AvatarImage
                  src={assignedUser.image || ""}
                  alt={assignedUser.name}
                />
                <AvatarFallback className="text-xs">
                  {assignedUser.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{assignedUser.name}</span>
            </>
          ) : (
            <>
              <CircleUserRoundIcon className="size-3.5 stroke-muted-foreground" />
              <span className="text-xs">Unassigned</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border w-full min-w-48 p-0" align="start">
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
                {assignedUser === undefined && (
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
                  {assignedUser?.id === item.id && (
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
