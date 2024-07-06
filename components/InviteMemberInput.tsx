import React from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Cross1Icon } from "@radix-ui/react-icons";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { FormValues } from "./onboarding/InviteMembers";
import { EUserWorkspaceRoles } from "@/lib/types/Workspace";
import { RoleEnum } from "@/generated/dto/invitation-dto";

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

const InviteMemberInput = (props: InviteMemberFormProps) => {
  const { fields, index, remove, control, watch } = props;

  return (
    <div className="flex w-ful gap-4 group items-center my-2">
      <Controller
        control={control}
        name={`emails.${index}.email`}
        rules={{
          pattern: {
            value: emailRegex,
            message: "Invalid Email ID",
          },
        }}
        render={({ field: { value, onChange, ref } }) => (
          <Input
            id={`emails.${index}.email`}
            name={`emails.${index}.email`}
            type="text"
            value={value}
            onChange={(event) => {
              // emailOnChange(event);
              onChange(event);
            }}
            ref={ref}
            placeholder={"tres@test.com"}
            className="w-full text-xs sm:text-sm"
            autoComplete="off"
          />
        )}
      />

      <Controller
        control={control}
        name={`emails.${index}.role`}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Select value={value} onValueChange={(value) => onChange(value)}>
            <SelectTrigger className="w-1/3">
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
          className="hidden cursor-pointer group-hover:block"
        />
      )}
    </div>
  );
};

export default InviteMemberInput;
