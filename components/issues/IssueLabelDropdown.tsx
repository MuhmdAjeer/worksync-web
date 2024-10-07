import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown, TagIcon } from "lucide-react";
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

interface IProps {
  onChange: (value: string[]) => void;
  projectId: string;
  value: string[];
}

const IssueLabelDropdown: React.FC<IProps> = ({
  onChange,
  projectId,
  value,
}) => {
  const [open, setOpen] = useState(false);
  const { data: labels } = useLabels(projectId);

  if (!labels) return null;

  console.log({ value });

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="flex gap-2"
          size="sm"
          onClick={() => setOpen(!open)}
        >
          {value.length ? (
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
            "Labels"
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
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
