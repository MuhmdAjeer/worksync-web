import * as React from "react";
import {
  AlertOctagonIcon,
  Check,
  SignalLowIcon,
  SignalHighIcon,
  SignalMediumIcon,
  CircleX,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
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
import { observer } from "mobx-react";
import { VariantProps } from "class-variance-authority";
import { PriorityEnum } from "@/generated/dto/create-issue-dto";

type TState = {
  name: string;
  Icon: React.ReactNode;
};

export const priorities: TState[] = [
  {
    name: "Urgent",
    Icon: <AlertOctagonIcon className="p-1 bg-red-500 text-white rounded-sm" />,
  },
  {
    name: "High",
    Icon: (
      <SignalHighIcon className="p-1 bg-orange-100 text-orange-300 border border-orange-300 rounded-sm" />
    ),
  },
  {
    name: "Medium",
    Icon: (
      <SignalMediumIcon className="p-1 bg-yellow-50 text-yellow-500 border border-yellow-500 rounded-sm" />
    ),
  },
  {
    name: "Low",
    Icon: (
      <SignalLowIcon className="p-1 bg-blue-50 text-blue-300 border-blue-300 border rounded-sm" />
    ),
  },
  {
    name: "None",
    Icon: <CircleX className="p-1 border rounded-sm" />,
  },
];

interface IProps extends VariantProps<typeof buttonVariants> {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  onChange?: (value: TState) => void;
  className?: string;
  defaultValue?: PriorityEnum;
}

const IssuePriorityDropdown: React.FC<IProps> = observer(
  ({ onOpenChange, open, onChange, variant, className, defaultValue }) => {
    const defaultPriority = priorities.find((x) => x.name == defaultValue)
    const [value, setValue] = React.useState(defaultPriority ?? priorities.at(0));

    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={variant ?? "outline"}
            role="combobox"
            size="sm"
            aria-expanded={open}
            className={cn(
              "justify-between flex items-center gap-3",
              className
            )}
          >
            {value && (
              <>
                {value.Icon}
                <p className="text-xs">{value.name}</p>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 x-1000">
          <Command>
            <CommandInput placeholder="Search option" />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {priorities.map((priority) => (
                  <CommandItem
                    key={priority.name}
                    value={priority.name}
                    onSelect={(currentValue) => {
                      setValue(priority);
                      onChange?.(priority);
                      onOpenChange?.(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {priority.Icon}
                      <p className="text-primary text-xs">{priority.name}</p>
                    </span>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value?.name === priority.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

export default IssuePriorityDropdown;
