"use client";

import { priorityEnum } from "@/auth-schema";
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
import { PriorityIcon } from "@/lib/icons";
import { updatePriority } from "@/server/update-issue";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type IssuePriority = (typeof priorityEnum.enumValues)[number];

export default function PriorityChanger({
  issueId,
  priority,
}: {
  issueId: string;
  priority: IssuePriority;
}) {
  const router = useRouter();
  const allPriority = priorityEnum.enumValues;

  const [open, setOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(priority);

  const handleSelect = async (item: IssuePriority) => {
    setSelectedPriority(item);
    setOpen(false);
    try {
      await updatePriority({ issueId: issueId, priority: item });
      router.refresh();
      toast.success("Priority Updated", {
        icon: <PriorityIcon priority={item} className="size-4" />,
        description: "The issue priority has been updated.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update issue", {
        description: "An error occurred while updating the issue.",
      });
      setSelectedPriority(priority);
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
          <PriorityIcon priority={selectedPriority} className="size-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border w-full min-w-48 p-0" align="start">
        <Command>
          <CommandInput placeholder="Change priority..." />
          <CommandList>
            <CommandGroup>
              {allPriority.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <PriorityIcon priority={item} className="size-3.5" />
                    <span className="first-letter:uppercase">
                      {item.replace("_", " ")}
                    </span>
                  </div>
                  {selectedPriority === item && (
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
