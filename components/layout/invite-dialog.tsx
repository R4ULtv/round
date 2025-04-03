"use client";

import { useState, useCallback } from "react";
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
import { Label } from "@/components/ui/label";
import {
  ChevronRightIcon,
  MailIcon,
  SendIcon,
  UsersRoundIcon,
  XIcon,
} from "lucide-react";
import { createInvite } from "@/server/create-invite";
import { SidebarMenuButton } from "../ui/sidebar";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InviteDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emails, setEmails] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);

  const addEmail = useCallback(() => {
    if (!emails.trim()) return;

    const newEmails = emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email && EMAIL_REGEX.test(email));

    if (newEmails.length === 0) return;

    setEmailList((prevList) => [...new Set([...prevList, ...newEmails])]);
    setEmails("");
  }, [emails]);

  const removeEmail = useCallback((index: number) => {
    setEmailList((prevList) => prevList.filter((_, i) => i !== index));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addEmail();
      }
    },
    [addEmail],
  );

  const handleSubmit = useCallback(async () => {
    if (!emailList.length) return;

    try {
      setIsSubmitting(true);
      await createInvite(emailList, projectId);

      toast.success("Invite created", {
        description: "Your invite has been successfully created",
      });

      setOpen(false);
      setEmails("");
      setEmailList([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create invite", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [emailList, projectId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton className="text-sidebar-foreground/70">
          <SendIcon className="text-sidebar-foreground/70" />
          <span>Invite to collaborate...</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="p-3 border-b">
          <DialogTitle className="flex items-center gap-1 text-sm">
            <span className="text-xs px-2 py-1 border rounded-sm text-muted-foreground flex items-center gap-1 select-none">
              <UsersRoundIcon className="size-3" />
              Raul Carini
            </span>
            <ChevronRightIcon className="size-3.5 text-muted-foreground" />
            Invite to collaborate
          </DialogTitle>
          <DialogDescription className="sr-only">
            Invite to collaborate with the project
          </DialogDescription>
        </DialogHeader>
        <div className="px-3 space-y-2">
          <Label htmlFor="emails" className="text-left">
            Email addresses
          </Label>
          <p className="text-muted-foreground text-sm">
            Invite users to collaborate with the project, press enter to insert
            email addresses.
          </p>
          <div className="relative">
            <Input
              id="emails"
              placeholder="Enter email addresses, separated by commas"
              className="pe-9"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
              <MailIcon size={16} aria-hidden="true" />
            </div>
          </div>
          <div className="rounded-md w-full flex flex-wrap gap-1">
            {emailList.map((email, index) => (
              <span
                key={email}
                className="transition-all inline-flex items-center pl-2 text-secondary-foreground disabled:cursor-not-allowed disabled:opacity-50 border-solid cursor-default animate-fadeIn relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7"
              >
                {email}
                <button
                  onClick={() => removeEmail(index)}
                  type="button"
                  className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-transparent absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground"
                >
                  <XIcon size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
        <DialogFooter className="p-3 border-t">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || emailList.length === 0}
          >
            {isSubmitting ? "Inviting..." : "Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
