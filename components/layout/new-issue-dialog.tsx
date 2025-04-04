"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { ChevronRightIcon, PlusIcon, UsersRoundIcon } from "lucide-react";

import StatusSelector from "@/components/issues/status-selector";
import PrioritySelector from "@/components/issues/priority-selector";
import TargetDateSelector from "@/components/issues/target-date-selector";
import AssignedSelector from "@/components/issues/assigned-selector";
import ProjectSelector from "@/components/issues/project-selector";
import LabelsSelector from "@/components/issues/labels-selector";

import {
  priorityEnum,
  statusEnum,
  issue as issueSchema,
  user as userSchema,
  project as projectSchema,
  labels as labelsSchema,
} from "@/auth-schema";
import { createIssue } from "@/server/new-issue";

type IssueStatus = (typeof statusEnum.enumValues)[number];
type PriorityStatus = (typeof priorityEnum.enumValues)[number];
type Label = (typeof labelsSchema)[number];

type IssueFormValues = {
  title: typeof issueSchema.$inferSelect.title;
  description: typeof issueSchema.$inferSelect.description;
  status: IssueStatus;
  priority: PriorityStatus;
  assignedUser?: typeof userSchema.$inferSelect;
  targetDate?: Date;
  project: typeof projectSchema.$inferSelect;
  labels: Label[];
};

export default function NewIssueDialog({
  defaultProject,
  members,
  projects,
}: {
  defaultProject: typeof projectSchema.$inferSelect;
  members: (typeof userSchema.$inferSelect)[];
  projects: (typeof projectSchema.$inferSelect)[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [createMore, setCreateMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);

  const defaultValues = useMemo<IssueFormValues>(
    () => ({
      title: "",
      description: null,
      status: "backlog",
      priority: "no_priority",
      assignedUser: undefined,
      targetDate: undefined,
      project: defaultProject,
      labels: [],
    }),
    [defaultProject],
  );

  const [formValues, setFormValues] = useState<IssueFormValues>(defaultValues);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const isInputActive =
        document.activeElement instanceof HTMLElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA");
      if (
        e.key === "c" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !open &&
        !isInputActive
      ) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [open]);

  const handleCreateMore = useCallback((checked: boolean) => {
    setCreateMore(checked);
  }, []);

  const resetForm = useCallback(() => {
    setFormValues(defaultValues);
    setSelectedLabels([]);
  }, [defaultValues]);

  const handleSubmit = useCallback(async () => {
    if (!formValues.title.trim()) {
      toast.error("Title is required", {
        description: "Please enter a title for your issue",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await createIssue({
        title: formValues.title,
        description: formValues.description,
        status: formValues.status,
        priority: formValues.priority,
        targetDate: formValues.targetDate,
        projectId: formValues.project.id,
        assignedUserId: formValues.assignedUser?.id,
        labels: selectedLabels.map((label) => label.label),
      });

      toast.success("Issue created", {
        description: "Your issue has been successfully created",
      });

      router.refresh();

      if (!createMore) {
        setOpen(false);
      }

      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create issue", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formValues, selectedLabels, createMore, resetForm, router]);

  const handleDialogChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        resetForm();
      }
    },
    [resetForm],
  );

  const handleInputChange = useCallback(
    (
      field: keyof IssueFormValues,
      value: IssueFormValues[keyof IssueFormValues],
    ) => {
      setFormValues((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Create new issue">
          <PlusIcon className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-0">
        <DialogHeader className="p-3 border-b">
          <DialogTitle className="flex items-center gap-1 text-sm">
            <span className="text-xs px-2 py-1 border rounded-sm text-muted-foreground flex items-center gap-1 select-none">
              <UsersRoundIcon className="size-3" />
              Raul Carini
            </span>
            <ChevronRightIcon className="size-3.5 text-muted-foreground" /> New
            Issue
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create a new issue for the current project
          </DialogDescription>
        </DialogHeader>
        <div className="px-3">
          <div className="space-y-2">
            <Input
              id="issue-title"
              autoFocus
              autoComplete="off"
              aria-label="Issue title"
              placeholder="Issue title"
              value={formValues.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="border-none w-full shadow-none outline-none text-2xl font-medium px-0 h-auto focus-visible:ring-0 overflow-hidden text-ellipsis whitespace-normal break-words bg-transparent dark:bg-transparent"
            />
            <Textarea
              id="issue-description"
              aria-label="Issue description"
              placeholder="Add description..."
              value={formValues.description || ""}
              onChange={(e) =>
                handleInputChange("description", e.target.value || null)
              }
              className="border-none w-full shadow-none outline-none resize-none px-0 min-h-16 focus-visible:ring-0 break-words whitespace-normal overflow-wrap bg-transparent dark:bg-transparent"
            />
            <div className="w-full flex items-center justify-start gap-1.5 flex-wrap">
              <StatusSelector
                status={formValues.status}
                setStatus={(status) => handleInputChange("status", status)}
              />
              <PrioritySelector
                priority={formValues.priority}
                setPriority={(priority) =>
                  handleInputChange("priority", priority)
                }
              />
              <AssignedSelector
                members={members}
                assignedUser={formValues.assignedUser}
                setAssignedUser={(assignedUser) =>
                  handleInputChange("assignedUser", assignedUser)
                }
              />
              <ProjectSelector
                projects={projects}
                project={formValues.project}
                setProject={(project) => handleInputChange("project", project)}
              />
              <LabelsSelector
                selectedLabels={selectedLabels}
                setSelectedLabels={setSelectedLabels}
              />
              <TargetDateSelector
                targetDate={formValues.targetDate}
                setTargetDate={(targetDate) =>
                  handleInputChange("targetDate", targetDate)
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter className="p-3 border-t">
          <div className="inline-flex items-center gap-2">
            <Switch
              id="create-more"
              aria-label="Create more issues"
              checked={createMore}
              onCheckedChange={handleCreateMore}
            />
            <Label
              htmlFor="create-more"
              className="text-xs text-muted-foreground"
            >
              Create more
            </Label>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formValues.title.trim()}
          >
            {isSubmitting ? "Creating..." : "Create Issue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
