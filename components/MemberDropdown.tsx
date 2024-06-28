import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

interface IProps {
  label?: string;
}

const MemberDropdown: React.FC<IProps> = ({ label = "Lead" }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const session = useSession();
  const members: User[] = [session.data?.user!];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" justify-between"
        >
          {value
            ? members.find((member) => member?.name === value)?.name
            : label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search member" />
          <CommandEmpty>No member found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {members.map(
                (member) =>
                  member && (
                    <CommandItem
                      key={member.id}
                      value={member.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === member.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {member.name}
                    </CommandItem>
                  )
              )}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MemberDropdown;
