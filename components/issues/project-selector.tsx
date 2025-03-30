import { project as projectSchema } from "@/auth-schema";
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
import { CheckIcon, BoxIcon, LockIcon, LockOpenIcon } from "lucide-react";

import { useState } from "react";

export default function ProjectSelector({
  projects,
  project,
  setProject,
}: {
  projects: (typeof projectSchema.$inferSelect)[];
  project: typeof projectSchema.$inferSelect;
  setProject: (project: typeof projectSchema.$inferSelect) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (project: typeof projectSchema.$inferSelect) => {
    setProject(project);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="flex items-center justify-center m-0 h-7 rounded-sm"
          variant="outline"
          size="sm"
          role="combobox"
        >
          <BoxIcon className="size-4 stroke-muted-foreground" />
          <span className="text-xs">{project.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border w-full min-w-48 p-0" align="start">
        <Command>
          <CommandInput placeholder="Change project..." />
          <CommandList>
            <CommandGroup>
              {projects.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {item.isPublic ? (
                      <LockOpenIcon className="size-4 stroke-muted-foreground" />
                    ) : (
                      <LockIcon className="size-4 stroke-muted-foreground" />
                    )}
                    <span>{item.name}</span>
                  </div>
                  {project?.id === item.id && (
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
