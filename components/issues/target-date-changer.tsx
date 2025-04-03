"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarX2Icon } from "lucide-react";
import { useState } from "react";
import { updateTargetDate } from "@/server/update-issue";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TargetDateChanger({
  issueId,
  targetDate,
}: {
  issueId: string;
  targetDate: Date | undefined;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(targetDate);

  const handleSave = async () => {
    if (!open) return setOpen(true);

    setOpen(false);
    if (selectedDate !== targetDate) {
      try {
        await updateTargetDate({
          issueId: issueId,
          targetDate: selectedDate || null,
        });
        router.refresh();
        toast.success("Target Date Updated", {
          description: "The issue target date has been updated.",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to update issue", {
          description: "An error occurred while updating the issue.",
        });
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={handleSave}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full has-[>svg]:px-3 text-xs h-7"
        >
          <CalendarX2Icon className="size-3.5" />
          {selectedDate?.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border w-full min-w-48 p-0" align="end">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
        />
      </PopoverContent>
    </Popover>
  );
}
