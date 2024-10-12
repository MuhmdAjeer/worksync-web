import React, { useState } from "react";
import { useProjectMembers } from "@/hooks/projects";
import { OptionType } from "../IssueFilterDropdown";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import ButtonAvatar from "../user/ButtonAvatars";
import { IDropdownProps } from "@/lib/types/Dropdown";

interface IProps extends IDropdownProps {
  projectId: string;
  onChange: (value: string[] | string) => void;
  label: string;
  value: string[] | string;
  multiple?: boolean;
}

export default function ProjectMembersDropdown({
  projectId,
  onChange,
  label,
  button,
  value,
  dropdownArrow = true,
  showIcons,
  buttonClassName,
  buttonVariant = "default",
  multiple = false,
}: IProps) {
  const [open, setOpen] = useState(false);
  const { data: members } = useProjectMembers(projectId);

  if (!members) return null;

  const options: OptionType[] = members.map((x) => ({
    label: x.user.username ?? "",
    value: x.user.id,
  }));

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValue = Array.isArray(value)
        ? value.includes(optionValue)
          ? value.filter((item) => item !== optionValue)
          : [...value, optionValue]
        : [optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setOpen(false);
    }
  };

  const isSelected = (optionValue: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const displayValue = () => {
    if (showIcons) {
      return <ButtonAvatar userIds={value} />;
    }

    if (!multiple && typeof value === "string") {
      const selectedOption = options.find((option) => option.value === value);
      return selectedOption ? selectedOption.label : label;
    }
    return label;
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {button ? (
          button
        ) : (
          <Button
            variant={buttonVariant}
            role="combobox"
            aria-expanded={open}
            className={cn("group flex gap-2", buttonClassName)}
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {displayValue()}
            {dropdownArrow && (
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search ..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              <ScrollArea className="max-h-44">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected(option.value) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
