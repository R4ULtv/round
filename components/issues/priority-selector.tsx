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
import { CheckIcon } from "lucide-react";
import { useState } from "react";

type IssuePriority = (typeof priorityEnum.enumValues)[number];

export default function PrioritySelector({
  priority,
  setPriority,
}: {
  priority: IssuePriority;
  setPriority: (priority: IssuePriority) => void;
}) {
  const allPriority = priorityEnum.enumValues;

  const [open, setOpen] = useState(false);

  const handleSelect = (item: IssuePriority) => {
    setPriority(item);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="flex items-center justify-center m-0 h-7 rounded-sm"
          size="sm"
          variant="outline"
          role="combobox"
        >
          <PriorityIcon priority={priority} className="size-3.5" />
          <span className="first-letter:uppercase text-xs">
            {priority.replace("_", " ")}
          </span>
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
                  {priority === item && (
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
