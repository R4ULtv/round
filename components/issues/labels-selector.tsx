import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CheckIcon, PlusCircleIcon, TagsIcon } from "lucide-react";
import { labels as labelsMap } from "@/auth-schema";

type Label = (typeof labelsMap)[number];

export default function LabelsSelector({
  selectedLabels,
  setSelectedLabels,
}: {
  selectedLabels: Label[];
  setSelectedLabels: (labels: Label[]) => void;
}) {
  const handleToggleLabel = (label: Label) => {
    if (
      selectedLabels.some(
        (selectedLabel) => selectedLabel.label === label.label,
      )
    ) {
      setSelectedLabels(
        selectedLabels.filter(
          (selectedLabel) => selectedLabel.label !== label.label,
        ),
      );
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="flex items-center justify-center m-0 h-7 rounded-sm"
          variant="outline"
          size="sm"
          role="combobox"
          aria-label="Select labels"
        >
          {selectedLabels.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-0.5">
                {selectedLabels.slice(0, 3).map((label) => (
                  <div
                    key={label.label}
                    className="size-3 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                ))}
              </div>
              {selectedLabels.length === 1 ? (
                <span className="text-xs first-letter:uppercase">
                  {selectedLabels[0].label}
                </span>
              ) : (
                <span className="text-xs">{selectedLabels.length} labels</span>
              )}
            </div>
          ) : (
            <TagsIcon className="size-3.5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border w-full min-w-48 p-0" align="start">
        <Command>
          <CommandInput placeholder="Change labels..." />
          <CommandList>
            <CommandGroup>
              {labelsMap.map((label) => {
                const isSelected = selectedLabels.some(
                  (selectedLabel) => selectedLabel.label === label.label,
                );
                return (
                  <CommandItem
                    key={label.label}
                    value={label.label}
                    onSelect={() => handleToggleLabel(label)}
                  >
                    <div
                      className="border-input data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground pointer-events-none size-4 shrink-0 rounded-[4px] border transition-all select-none *:[svg]:opacity-0 data-[selected=true]:*:[svg]:opacity-100 mr-2"
                      data-selected={isSelected}
                    >
                      <CheckIcon className="size-3.5 text-current" />
                    </div>
                    <div
                      className="rounded-full size-2.5 mr-2"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="first-letter:uppercase">
                      {label.label}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem>
                <PlusCircleIcon className="size-4 mr-2" />
                <span>Create label...</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
