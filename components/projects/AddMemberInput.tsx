import React from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CaretSortIcon, Cross1Icon } from "@radix-ui/react-icons";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { FormValues } from "../onboarding/InviteMembers";
import { EUserWorkspaceRoles } from "@/lib/types/Workspace";
import { RoleEnum } from "@/generated/dto/invitation-dto";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { useWorkspaceMembers } from "@/hooks/workspaces";
import { useRouter } from "next/router";
import { useProjectMembers } from "@/hooks/projects";

type InviteMemberFormProps = {
  index: number;
  remove: UseFieldArrayRemove;
  control: Control<FormValues, any>;
  setValue: UseFormSetValue<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  watch: UseFormWatch<FormValues>;
  field: FieldArrayWithId<FormValues, "emails", "id">;
  fields: FieldArrayWithId<FormValues, "emails", "id">[];
  errors: any;
};

export interface Field {
  email: string;
  role: EUserWorkspaceRoles;
}

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const AddMemberInput = (props: InviteMemberFormProps) => {
  const { fields, index, remove, control, watch } = props;
  const { workspaceSlug, projectId } = useRouter().query;
  const { data: workspaceMembers } = useWorkspaceMembers(
    workspaceSlug?.toString()!,
  );
  const { data: projectMembers } = useProjectMembers(projectId?.toString()!);
  console.log({ fields });
  const members = workspaceMembers?.filter(
    (x) => !projectMembers?.some((pm) => pm.user.id === x.user.id),
  );
  return (
    <div className="grid grid-cols-3 w-full gap-4 group items-center my-2">
      <Controller
        control={control}
        name={`emails.${index}.email`}
        rules={{
          required: true,
        }}
        render={({ field: { value, onChange, ref } }) => (
          <div ref={ref} className="w-full col-span-2">
            <Popover modal>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full justify-between")}
                >
                  {value
                    ? members?.find((m) => m.user.id === value)?.user.username
                    : "Select member"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search framework..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {members?.map((m) => (
                        <CommandItem
                          value={m.user.id}
                          key={m.id}
                          onSelect={(value) => {
                            onChange(value);
                          }}
                        >
                          {m.user.username}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              m.user.id === value ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
      />
      <div className="w-full flex items-center gap-2">
        <Controller
          control={control}
          name={`emails.${index}.role`}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <Select value={value} onValueChange={(value) => onChange(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  <SelectItem value={RoleEnum.Admin}>Admin</SelectItem>
                  <SelectItem value={RoleEnum.Member}>Member</SelectItem>
                  <SelectItem value={RoleEnum.Guest}>Guest</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {fields.length > 1 && (
          <Cross1Icon
            onClick={() => remove(index)}
            className="cursor-pointer hover:text-black group-hover:block"
          />
        )}
      </div>
    </div>
  );
};

export default AddMemberInput;
