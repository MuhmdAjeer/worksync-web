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
import { StackIcon } from "@radix-ui/react-icons";
import {
  AlignJustifyIcon,
  Grid,
  GridIcon,
  LayoutDashboard,
  ListIcon,
  SquareKanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IProps {
  children: ReactNode;
  currentView: string;
  handleCurrentView: (view: string) => void;
}

const IssueDisplay: React.FC<IProps> = ({
  children,
  currentView,
  handleCurrentView,
}) => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[15.75rem] p-4">
        <div className="flex gap-2 w-full">
          {["List", "Board"].map((view) => (
            <IssueView
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
