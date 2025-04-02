"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  ChevronRightIcon,
  FolderPenIcon,
  GlobeIcon,
  PlusIcon,
  UsersRoundIcon,
} from "lucide-react";

import { project as projectSchema } from "@/auth-schema";
import { createProject } from "@/server/new-project";
import { useRouter } from "next/navigation";

type ProjectFormValues = Omit<typeof projectSchema.$inferInsert, "ownerId">;

export default function NewProjectDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo<ProjectFormValues>(
    () => ({
      id: "",
      name: "",
      icon: "",
      shortName: "",
      description: "",
      isPublic: false,
      targetDate: undefined,
    }),
    [],
  );

  const [formValues, setFormValues] =
    useState<ProjectFormValues>(defaultValues);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const isInputActive =
        document.activeElement instanceof HTMLElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA");

      if (
        e.key === "p" &&
        (e.metaKey || e.ctrlKey) &&
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

  const resetForm = useCallback(() => {
    setFormValues(defaultValues);
  }, [defaultValues]);

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
      field: keyof ProjectFormValues,
      value: ProjectFormValues[keyof ProjectFormValues],
    ) => {
      setFormValues((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const validateShortName = useCallback((value: string) => {
    const regex = /^[A-Z]{3}$/;
    return regex.test(value);
  }, []);

  const validateProjectId = useCallback((value: string) => {
    return value.length >= 3 && value.length <= 20;
  }, []);

  const handleShortNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toUpperCase().slice(0, 3);
      handleInputChange("shortName", value);
    },
    [handleInputChange],
  );

  const handleProjectIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
        .toLowerCase()
        .replace(/[^a-z\s-]/g, "") // Remove all chars except lowercase letters, spaces, and dashes
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .slice(0, 20);
      handleInputChange("id", value);
    },
    [handleInputChange],
  );

  const handleSubmit = useCallback(async () => {
    if (!formValues.name.trim()) {
      toast.error("Project name is required", {
        description: "Please enter a name for your project",
      });
      return;
    }

    if (!formValues.id.trim() || !validateProjectId(formValues.id)) {
      toast.error("Valid project ID is required", {
        description: "Project ID must be between 5-20 characters",
      });
      return;
    }

    if (
      !formValues.shortName.trim() ||
      !validateShortName(formValues.shortName)
    ) {
      toast.error("Valid short name is required", {
        description: "Short name must be exactly 3 uppercase letters",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await createProject({
        id: formValues.id,
        name: formValues.name,
        icon: formValues.icon,
        shortName: formValues.shortName,
        description: formValues.description,
        isPublic: formValues.isPublic,
        targetDate: formValues.targetDate,
      });

      toast.success("Project created", {
        description: "Your project has been successfully created",
      });

      setOpen(false);
      resetForm();
      router.push(`/dashboard/${formValues.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formValues, resetForm, validateProjectId, validateShortName, router]);

  const isFormValid =
    formValues.name.trim() &&
    formValues.shortName.trim() &&
    validateShortName(formValues.shortName) &&
    formValues.id.trim() &&
    validateProjectId(formValues.id);

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Create new project">
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
            Project
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create a new project
          </DialogDescription>
        </DialogHeader>
        <div className="px-3">
          <div className="space-y-2">
            <Input
              id="project-name"
              autoFocus
              autoComplete="off"
              aria-label="Project name"
              placeholder="Project name"
              value={formValues.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="border-none w-full shadow-none outline-none text-2xl font-medium px-0 h-auto focus-visible:ring-0 overflow-hidden text-ellipsis whitespace-normal break-words bg-transparent dark:bg-transparent"
            />
            <Textarea
              id="project-description"
              aria-label="Project description"
              placeholder="Add description..."
              value={formValues.description || ""}
              onChange={(e) =>
                handleInputChange("description", e.target.value || "")
              }
              className="border-none w-full shadow-none outline-none resize-none px-0 min-h-16 focus-visible:ring-0 break-words whitespace-normal overflow-wrap bg-transparent dark:bg-transparent"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="project-id">
                  Project ID{" "}
                  <span className="text-muted-foreground text-xs">
                    Used as the URL (e.g., /example-project)
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="project-id"
                    placeholder="example-project"
                    type="text"
                    value={formValues.id}
                    onChange={handleProjectIdChange}
                    maxLength={20}
                    className="ps-9 pe-14"
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <GlobeIcon size={16} aria-hidden="true" />
                  </div>
                  <div
                    id="project-id-description"
                    className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums peer-disabled:opacity-50"
                    aria-live="polite"
                    role="status"
                  >
                    {formValues.id.length}/20
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="short-name">
                  Short Name{" "}
                  <span className="text-muted-foreground text-xs">
                    Used for issue tracking (e.g., PRJ-123)
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="short-name"
                    placeholder="PRJ"
                    type="text"
                    className="ps-9 pe-14"
                    value={formValues.shortName}
                    onChange={handleShortNameChange}
                    maxLength={3}
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <FolderPenIcon size={16} aria-hidden="true" />
                  </div>
                  <div
                    id="short-name-description"
                    className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums peer-disabled:opacity-50"
                    aria-live="polite"
                    role="status"
                  >
                    {formValues.shortName.length}/3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="p-3 border-t">
          <div className="inline-flex items-center gap-2">
            <Switch
              id="isPublic"
              aria-label="Make it public"
              checked={formValues.isPublic}
              onCheckedChange={(checked) =>
                handleInputChange("isPublic", checked)
              }
            />
            <Label htmlFor="isPublic" className="text-xs text-muted-foreground">
              Publicly visible to all users
            </Label>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
