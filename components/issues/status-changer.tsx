"use client";

import { statusEnum } from "@/auth-schema";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StatusIcon } from "@/lib/icons";
import { updateStatus } from "@/server/update-issue";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type IssueStatus = (typeof statusEnum.enumValues)[number];

export default function StatusChanger({
  issueId,
  status,
}: {
  issueId: string;
  status: IssueStatus;
}) {
  const allStatus = statusEnum.enumValues;
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);

  const handleSelect = async (item: IssueStatus) => {
    setSelectedStatus(item);
    setOpen(false);
    try {
      await updateStatus({ issueId: issueId, status: item });
      toast.success("Status Updated", {
        icon: <StatusIcon status={item} className="size-4" />,
        description: "The issue status has been updated.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update issue", {
        description: "An error occurred while updating the issue.",
      });
      setSelectedStatus(status);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="m-0 h-auto py-1.5 has-[>svg]:px-1.5 rounded-sm"
          size="sm"
          variant="ghost"
          role="combobox"
        >
          <StatusIcon status={selectedStatus} className="size-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border w-full min-w-48 p-0" align="start">
        <Command>
          <CommandInput placeholder="Change status..." />
          <CommandList>
            <CommandGroup>
              {allStatus.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <StatusIcon status={item} className="size-3.5" />
                    <span className="first-letter:uppercase">
                      {item.replace("_", " ")}
                    </span>
                  </div>
                  {selectedStatus === item && (
                    <CheckIcon className="size-4 ml-auto" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
