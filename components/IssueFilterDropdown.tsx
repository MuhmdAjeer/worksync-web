import * as React from "react";
import { cn } from "@/lib/utils";

import { Check, X, ChevronsUpDown } from "lucide-react";
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
import { ScrollArea } from "./ui/scroll-area";
import { useProjectStates } from "@/hooks/projects";
import { useProjectStore } from "@/hooks/store/project";
import { useAppRouter } from "@/hooks/router";
import { IssueStateDto } from "@/generated/dto/issue-state-dto";

export type OptionType = {
  label: string| React.ReactNode;
  value: string;
};

interface MultiSelectProps {
  className?: string;
  label: string;
  onChange: (values: string[]) => void;
}

function IssueFilterDropdown({
  onChange,
  className,
  label,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const { projectId } = useAppRouter();
  const { data: states } = useProjectStates(projectId!);
  const [selectedStates, setSelectedStates] = React.useState<string[]>([]);

  return (
    <Popover modal open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex gap-2"
          size="sm"
          onClick={() => setOpen(!open)}
        >
          {label}
          {/* <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className={className}>
          <CommandInput placeholder="Search ..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              <ScrollArea className="h-44">
                {states?.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      //   onChange(
                      setSelectedStates((prev) =>
                        prev.includes(option.id)
                          ? prev.filter((item) => item !== option.id)
                          : [...prev, option.id]
                      );
                      //   );
                      setOpen(true);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedStates.includes(option.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
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
}

export default IssueFilterDropdown;
