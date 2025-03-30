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
import { CheckIcon } from "lucide-react";
import { useState } from "react";

type IssueStatus = (typeof statusEnum.enumValues)[number];

export default function StatusSelector({
  status,
  setStatus,
}: {
  status: IssueStatus;
  setStatus: (status: IssueStatus) => void;
}) {
  const allStatus = statusEnum.enumValues;

  const [open, setOpen] = useState(false);

  const handleSelect = (item: IssueStatus) => {
    setStatus(item);
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
          <StatusIcon status={status} className="size-3.5" />
          <span className="first-letter:uppercase text-xs">
            {status.replace("_", " ")}
          </span>
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
                  {status === item && <CheckIcon className="size-4 ml-auto" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
