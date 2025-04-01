"use client";
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
import { CheckIcon, PlusCircleIcon } from "lucide-react";
import { labels as labelsMap, issue as issueSchema } from "@/auth-schema";
import { useState } from "react";
import { toast } from "sonner";
import { updateLabels } from "@/server/update-issue";

type Label = (typeof labelsMap)[number];

export default function LabelsChanger({
  issueId,
  labels,
}: {
  issueId: string;
  labels: NonNullable<typeof issueSchema.$inferInsert.labels>;
}) {
  const [open, setOpen] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>(() =>
    labels
      .map((labelName) => labelsMap.find((l) => l.label === labelName)!)
      .filter(Boolean),
  );

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

  const handleSave = async (isOpen: boolean) => {
    if (isOpen) {
      setOpen(true);
      return;
    }

    const currentLabels = labels;
    const newLabels = selectedLabels.map((label) => label.label);

    setOpen(false);
    if (
      JSON.stringify(currentLabels.sort()) !== JSON.stringify(newLabels.sort())
    ) {
      try {
        await updateLabels({
          issueId,
          labels: newLabels,
        });
        toast.success("Labels Updated", {
          description: "The issue labels have been updated.",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to update labels", {
          description: "An error occurred while updating the labels.",
        });
        setSelectedLabels(
          labels
            .map((labelName) => labelsMap.find((l) => l.label === labelName)!)
            .filter(Boolean),
        );
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={handleSave}>
      {selectedLabels.map((item) => (
        <PopoverTrigger asChild key={item.label}>
          <Button
            className="rounded-full text-xs h-7"
            variant="outline"
            size="sm"
            role="combobox"
            aria-label="Select labels"
          >
            <div
              className="size-2.5 rounded-full"
              style={{ backgroundColor: item.color || "#888888" }}
            />
            <span className="first-letter:uppercase text-muted-foreground">
              {item.label}
            </span>
          </Button>
        </PopoverTrigger>
      ))}
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
