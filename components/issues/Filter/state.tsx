import FilterHeader from "./FilterHeader";
import FilterOption from "./FilterOption";
import React, { useState } from "react";
import { useProjectStates } from "@/hooks/projects";
import { useAppRouter } from "@/hooks/router";
import IssueStateIcon from "@/components/icons/IssueStateIcon";
import { SelectSeparator } from "@/components/ui/select";

interface IProps {
  searchQuery: string;
}

const StateFilter: React.FC<IProps> = ({ searchQuery }) => {
  const { projectId } = useAppRouter();
  const { data: states } = useProjectStates(projectId!);

  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [values, setValues] = useState<string[]>([]);

  const filteredStates = states?.filter((x) =>
    x.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="font-medium text-primary/70">
      <FilterHeader
        handlePreviewEnabled={() => setPreviewEnabled((v) => !v)}
        isPreviewEnabled={previewEnabled}
        title="State"
      />
      {previewEnabled && filteredStates ? (
        <>
          {filteredStates.map((option) => (
            <FilterOption
              handleSelect={() => {
                setValues((prev) =>
                  prev.includes(option.id)
                    ? prev.filter((item) => item !== option.id)
                    : [...prev, option.id]
                );
              }}
              isSelected={values.includes(option.id)}
              title={option.name}
              key={option.id}
              icon={<IssueStateIcon group={option.group} />}
            />
          ))}
        </>
      ) : null}
      <SelectSeparator />
    </div>
  );
};

export default StateFilter;
