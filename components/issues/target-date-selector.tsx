import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarX2Icon } from "lucide-react";

export default function TargetDateSelector({
  targetDate,
  setTargetDate,
}: {
  targetDate: Date | undefined;
  setTargetDate: (date: Date | undefined) => void;
}) {
  const handleDateChange = (date: Date | undefined) => {
    setTargetDate(date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="flex items-center justify-center m-0 h-7 rounded-sm"
          variant="outline"
          size="sm"
          role="combobox"
        >
          <CalendarX2Icon className="size-3.5" />

          {targetDate && (
            <span className="text-xs">
              {targetDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border w-full min-w-48 p-0" align="start">
        <Calendar
          mode="single"
          selected={targetDate}
          onSelect={handleDateChange}
        />
      </PopoverContent>
    </Popover>
  );
}
