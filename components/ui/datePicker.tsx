"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateAfter, DateBefore, DateInterval, Matcher } from "react-day-picker";
import { VariantProps } from "class-variance-authority";
import { IDropdownProps } from "@/lib/types/Dropdown";

interface IDatePicker extends IDropdownProps {
  label: string;
  value?: Date;
  onChange: (value: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker: React.FC<IDatePicker> = ({
  buttonVariant = "ghost",
  buttonSize = "sm",
  buttonClassName,
  showIcons = true,
  button,
  ...props
}) => {
  const { label, onChange, value, minDate, maxDate } = props;
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [disabled, setDisabled] = React.useState<Matcher>();

  React.useEffect(() => {
    if (minDate && maxDate) {
      const intervalMatcher: DateInterval = {
        after: maxDate,
        before: minDate,
      };
      setDisabled(intervalMatcher);
      return;
    }
    if (maxDate) {
      const afterMatcher: DateAfter = { after: maxDate };
      setDisabled(afterMatcher);
      return;
    }
    if (minDate) {
      const beforeMatcher: DateBefore = { before: minDate };
      setDisabled(beforeMatcher);
      return;
    }
  }, [minDate, maxDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {button ? (
          button
        ) : (
          <Button
            variant={buttonVariant}
            size={buttonSize}
            className={cn(
              " justify-start text-left font-normal",
              buttonClassName,
            )}
          >
            {showIcons && <CalendarIcon className="mr-2 h-4 w-4" />}
            {date ? format(date, "PPP") : <span>{label}</span>}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date);
            onChange(date);
          }}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
