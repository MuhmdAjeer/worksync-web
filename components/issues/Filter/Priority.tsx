import IssuePriorityIcon from "@/components/icons/IssuePriorityIcon";
import FilterHeader from "./FilterHeader";
import FilterOption from "./FilterOption";
import React, { useState } from "react";
import { PriorityEnum } from "@/generated/dto/create-issue-dto";
import { SelectSeparator } from "@/components/ui/select";

interface IProps {
  searchQuery: string;
}

const PriorityFilter: React.FC<IProps> = ({ searchQuery }) => {
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [values, setValues] = useState<string[]>([]);
  const priorities = Object.values(PriorityEnum).filter((x) =>
    x.toLocaleLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <SelectSeparator />
    </div>
  );
};

export default PriorityFilter;
