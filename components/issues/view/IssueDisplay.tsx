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
import {
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { StackIcon } from "@radix-ui/react-icons";
import {
  AlignJustifyIcon,
  Columns3,
  Grid,
  GridIcon,
  LayoutDashboard,
  ListIcon,
  Rows3,
  SquareKanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EIssueGroupBy } from "@/pages/[workspaceSlug]/projects/[projectId]/issues";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIssueGroupByOptions } from "@/lib/types/issue";
import { ISSUE_GROUP_BY_KEYS } from "@/lib/kanban-utils";

interface IProps {
  children: ReactNode;
  currentView: string;
  handleCurrentView: (view: string) => void;
  groupBy: TIssueGroupByOptions;
  handleGroupByChange: (val: TIssueGroupByOptions) => void;
}

const IssueDisplay: React.FC<IProps> = ({
  children,
  currentView,
  handleCurrentView,
  handleGroupByChange,
  groupBy,
}) => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[18.75rem] p-4 flex flex-col gap-4 ">
        <div className="grid grid-cols-2 gap-2 w-full">
          {["List", "Board"].map((view) => (
            <IssueView
							key={view}
              isSelected={currentView === view}
              title={view}
              icon={
                view === "List" ? (
                  <AlignJustifyIcon className="h-5" />
                ) : (
                  <SquareKanban className="h-5" />
                )
              }
              handleChange={() => handleCurrentView(view)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((val) => (
            <SelectGroup key={val} className="grid grid-cols-2 text-primary/70 gap-2 items-center text-xs">
              <SelectLabel className="text-xs flex gap-1 items-center">
                <Columns3 className="h-4 w-4" />
                Columns
              </SelectLabel>
              <Select
                onValueChange={(v: TIssueGroupByOptions) => {
                  handleGroupByChange(v);
                }}
                value={groupBy}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {Object.keys(ISSUE_GROUP_BY_KEYS).map((v) => (
                    <SelectItem key={v} size="sm" value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SelectGroup>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface IPropsx {
  isSelected: boolean;
  title: string;
  icon: ReactNode;
  handleChange: () => void;
}

const IssueView: React.FC<IPropsx> = ({
  isSelected,
  title,
  icon,
  handleChange,
}) => {
  return (
    <Button
      variant="outline"
      onClick={handleChange}
      className={cn(
        "w-full border border-primary/10 text-primary/50 focus-visible:ring-0 h-auto flex flex-col items-center justify-center",
        isSelected ? "bg-secondary/50 text-primary" : ""
      )}
    >
      {icon}
      <span>{title}</span>
    </Button>
  );
};

export default IssueDisplay;
