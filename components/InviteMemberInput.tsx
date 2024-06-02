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
interface Iprops {
  field: Field;
  index: number;
  onChange: (index: number, field: Field) => void;
  remove: (index: number) => void;
}
export interface Field {
  email: string;
  role: string;
}
const InviteMemberInput = (props: Iprops) => {
  const { onChange, field, index, remove } = props;
  return (
    <div className="flex gap-4 group items-center">
      <Input
        className="w-auto"
        placeholder="joe@gmail.com"
        onChange={(e) => {
          onChange(index, { role: field.role, email: e.target.value });
        }}
      />
      <Select
        onValueChange={(value) =>
          onChange(index, { email: field.email, role: value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="guest">Guest</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Cross1Icon
        onClick={() => remove(index)}
        className="hidden cursor-pointer group-hover:block"
      />
    </div>
  );
};

export default InviteMemberInput;
