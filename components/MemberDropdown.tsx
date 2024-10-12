import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
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
import { useWorkspace, useWorkspaceMembers } from "@/hooks/workspaces";
import { useRouter } from "next/router";

interface IProps {
  label?: string;
  onChange: (value: string) => void;
  buttonProps?: ButtonProps;
  className?: string;
  disabled?: boolean;
  dropdownArrow?: boolean;
}

const MemberDropdown: React.FC<IProps> = ({
  label = "Lead",
  onChange,
  buttonProps,
  className,
  disabled,
  dropdownArrow = true,
}) => {
  const router = useRouter();
  const workspaceSlug = router.query.workspaceSlug?.toString();
  const { data: members } = useWorkspaceMembers(workspaceSlug!);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  if (!members) {
    return <></>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          {...buttonProps}
          className={cn("justify-between group", className)}
        >
          {value ? (
            members.find((member) => member?.id === value)?.user.username
          ) : (
            <span className="text-primary/50">{label}</span>
          )}

          {dropdownArrow && (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 invisible group-hover:visible" />
          )}
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
                        setValue(currentValue);
                        onChange(member.user.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === member.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {member.user.username}
                    </CommandItem>
                  ),
              )}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MemberDropdown;
