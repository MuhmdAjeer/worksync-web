import React, { useEffect, useState } from "react";
import {
  Check,
  ChevronsUpDown,
  ChevronsUpDownIcon,
  TagIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useLabels } from "@/hooks/projects";
import { Button, buttonVariants } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { IDropdownProps } from "@/lib/types/Dropdown";
import ButtonAvatar from "../user/ButtonAvatars";

interface IProps extends IDropdownProps {
  onChange: (value: string[]) => void;
  projectId: string;
  value: string[];
}

const IssueLabelDropdown: React.FC<IProps> = ({
  onChange,
  projectId,
  value,
  buttonClassName,
  buttonVariant,
  dropdownArrow,
  showIcons,
  label,
  button,
}) => {
  const [open, setOpen] = useState(false);
  const { data: labels } = useLabels(projectId);

  if (!labels) return null;

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
            {showIcons ? (
              <>
                <div
                  style={{
                    backgroundColor: "red",
                  }}
                  className="rounded-full h-3 w-3"
                ></div>
                <p>{`${value.length} Labels`}</p>
              </>
            ) : (
              label
            )}
            {dropdownArrow && (
              <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
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
                {labels.map((option) => (
                  <CommandItem
                    key={option.id}
                    className="flex gap-2 items-center"
                    onSelect={() => {
                      onChange(
                        value.includes(option.id)
                          ? value.filter((item) => item !== option.id)
                          : [...value, option.id],
                      );
                      setOpen(true);
                    }}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value?.includes(option.id)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div
                      style={{
                        backgroundColor: option.color,
                      }}
                      className="rounded-full h-3 w-3"
                    ></div>
                    {option.name}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default IssueLabelDropdown;
