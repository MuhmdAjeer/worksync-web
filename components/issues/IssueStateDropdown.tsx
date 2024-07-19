import React, { useCallback, useEffect } from "react";
import {
  Check,
  ChevronsUpDown,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleIcon,
  CircleXIcon,
  LoaderCircleIcon,
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
import { useProjectStates } from "@/hooks/projects";
import { useAppRouter } from "@/hooks/router";
import { IssueStateDto } from "@/generated/dto/issue-state-dto";
import IssueStateIcon from "../icons/IssueStateIcon";
import { useRouter } from "next/router";
import { VariantProps } from "class-variance-authority";

type TState = {
  name: string;
  Icon: React.ReactNode;
};

interface IProps extends VariantProps<typeof buttonVariants> {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  onChange: (value: IssueStateDto) => void;
  projectId: string;
  className?: string;
  defaultValue?: string;
}

const IssueStatesDropdown: React.FC<IProps> = observer(
  ({
    onOpenChange,
    open,
    onChange,
    projectId,
    className,
    variant = "outline",
    defaultValue,
  }) => {
    const { data: issueStates } = useProjectStates(projectId);

    const [value, setValue] = React.useState(issueStates?.at(0));

    useEffect(() => {
      if (defaultValue) {
        const state = issueStates?.find((x) => x.id === defaultValue);
        if (state) {
          setValue(state);
        }
        return;
      }
      if (issueStates) {
        setValue(issueStates.at(0));
      }
    }, [issueStates]);

    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            role="combobox"
            size="sm"
            aria-expanded={open}
            className={cn("justify-between flex items-center gap-3", className)}
          >
            {value && (
              <>
                <IssueStateIcon
                  height="16px"
                  width="16px"
                  group={value.group}
                />
                <p className=" text-xs">{value.name}</p>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 x-1000">
          <Command>
            <CommandInput placeholder="Search state..." />
            <CommandEmpty>No state found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {issueStates?.map((state) => (
                  <CommandItem
                    key={state.name}
                    value={state.name}
                    onSelect={(currentValue) => {
                      setValue(state);
                      onChange(state);
                      onOpenChange?.(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <IssueStateIcon group={state.group} />
                      <p className=" text-xs">{state.name}</p>
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

export default IssueStatesDropdown;
