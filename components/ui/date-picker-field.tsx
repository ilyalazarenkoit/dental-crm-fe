"use client";

import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
  error?: boolean;
}

export const DatePickerField = ({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  fromYear = 1900,
  toYear = new Date().getFullYear(),
  error = false,
}: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);

  const parsedDate =
    value && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? parse(value, "yyyy-MM-dd", new Date())
      : undefined;

  const validDate = parsedDate && isValid(parsedDate) ? parsedDate : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date && isValid(date)) {
      onChange(format(date, "yyyy-MM-dd"));
    } else {
      onChange("");
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !validDate && "text-muted-foreground",
            error && "border-destructive"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {validDate ? format(validDate, "dd MMM yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={validDate}
          onSelect={handleSelect}
          disabled={(date) =>
            date > new Date() ||
            date < new Date(`${fromYear}-01-01`) ||
            date > new Date(`${toYear}-12-31`)
          }
          defaultMonth={validDate ?? new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
