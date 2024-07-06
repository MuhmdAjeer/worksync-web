import * as React from "react";
import {
  AlertOctagonIcon,
  Check,
  SignalLowIcon,
  SignalHighIcon,
  SignalMediumIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

type TState = {
  name: string;
  Icon: React.ReactNode;
};


const issueStates: TState[] = [
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
];

interface IProps {
  open: boolean;
  onOpenChange?: (value: boolean) => void;
  onChange?: (value: TState) => void;
}

const IssuePriorityDropdown: React.FC<IProps> = observer(
  ({ onOpenChange, open, onChange }) => {
    const [value, setValue] = React.useState(issueStates.at(0));

    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="sm"
            aria-expanded={open}
            className="justify-between flex items-center gap-3"
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
                {issueStates.map((state) => (
                  <CommandItem
                    key={state.name}
                    value={state.name}
                    onSelect={(currentValue) => {
                      setValue(state);
                      onChange?.(state);
                      onOpenChange?.(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {state.Icon}
                      <p className="text-primary text-xs">{state.name}</p>
                    </span>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value?.name === state.name ? "opacity-100" : "opacity-0"
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
