import React, { ReactNode, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PriorityFilter from "../Filter/Priority";
import AssigneesFilter from "../Filter/assignees";
import StateFilter from "../Filter/state";
import { Input } from "@/components/ui/input";
import { SelectSeparator } from "@/components/ui/select";

interface IProps {
  children: ReactNode;
}

const IssueFilter: React.FC<IProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Popover modal>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[15.75rem] p-2">
        <Input
          placeholder="Filter..."
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          className="border-none ring-0 focus-visible:ring-0 outline-none p-0"
        />
        <SelectSeparator />
        <PriorityFilter searchQuery={searchQuery} />
        <StateFilter searchQuery={searchQuery} />
        <AssigneesFilter searchQuery={searchQuery} />
      </PopoverContent>
    </Popover>
  );
};

export default IssueFilter;
