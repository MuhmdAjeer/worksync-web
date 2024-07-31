import React, { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import IssuePriorityIcon from "@/components/icons/IssuePriorityIcon";
import { PriorityEnum } from "@/generated/dto/create-issue-dto";

interface IProps {
  children: ReactNode;
}

const IssueFilter: React.FC<IProps> = ({ children }) => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[18.75rem] p-2">
        <div className="">
          <PriorityFilter />
        </div>
      </PopoverContent>
    </Popover>
  );
};

const PriorityFilter = () => {
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [values, setValues] = useState<string[]>([]);
  const priorities = Object.values(PriorityEnum);

  return (
    <div className="font-medium text-primary/70">
      <FilterHeader
        handlePreviewEnabled={() => setPreviewEnabled((v) => !v)}
        isPreviewEnabled={previewEnabled}
        title="Priority"
      />
      {previewEnabled ? (
        <>
          {priorities.map((option) => (
            <FilterOption
              handleSelect={() => {
                setValues((prev) =>
                  prev.includes(option)
                    ? prev.filter((item) => item !== option)
                    : [...prev, option]
                );
              }}
              isSelected={values.includes(option)}
              title={option}
              key={option}
              icon={<IssuePriorityIcon group={option} />}
            />
          ))}
        </>
      ) : null}
    </div>
  );
};

interface IFilterHeaderProps {
  isPreviewEnabled: boolean;
  handlePreviewEnabled: () => void;
  title: string;
}

const FilterHeader: React.FC<IFilterHeaderProps> = ({
  isPreviewEnabled,
  handlePreviewEnabled,
  title,
}) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium text-primary/50">{title}</p>
      <Button
        onClick={() => handlePreviewEnabled()}
        variant="ghost"
        className="h-6 px-1 outline-none"
      >
        {isPreviewEnabled ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

interface IOption {
  handleSelect: () => void;
  isSelected: boolean;
  icon: ReactNode;
  title: string;
}

const FilterOption: React.FC<IOption> = ({
  handleSelect,
  isSelected,
  icon,
  title,
}) => {
  return (
    <Button
      onClick={() => {
        handleSelect();
      }}
      type="button"
      size="sm"
      variant="ghost"
      className="flex w-full justify-normal h-7 items-center gap-2  m-0 px-2 rounded "
    >
      <Checkbox className="" checked={isSelected} />
      {icon}
      <span className="text-xs font-medium">{title}</span>
    </Button>
  );
};

export default IssueFilter;
