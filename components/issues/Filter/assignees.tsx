import FilterHeader from "./FilterHeader";
import FilterOption from "./FilterOption";
import React, { useState } from "react";
import { useProjectMembers, useProjectStates } from "@/hooks/projects";
import { useAppRouter } from "@/hooks/router";

interface IProps {
  searchQuery: string;
}

const AssigneesFilter: React.FC<IProps> = ({ searchQuery }) => {
  const { projectId } = useAppRouter();
  const { data: members } = useProjectMembers(projectId!);

  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [values, setValues] = useState<string[]>([]);

  const filteredMembers = members?.filter((x) =>
    x.user.username?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="font-medium text-primary/70">
      <FilterHeader
        handlePreviewEnabled={() => setPreviewEnabled((v) => !v)}
        isPreviewEnabled={previewEnabled}
        title="Assignees"
      />
      {previewEnabled && filteredMembers ? (
        <>
          {filteredMembers.map((option) => (
            <FilterOption
              handleSelect={() => {
                setValues((prev) =>
                  prev.includes(option.id)
                    ? prev.filter((item) => item !== option.id)
                    : [...prev, option.id]
                );
              }}
              isSelected={values.includes(option.id)}
              title={option.user.username ?? option.user.email}
              key={option.id}
              icon={
                <img
                  src={option.user.profile_picture}
                  className="h-5 w-5 rounded-full"
                />
              }
            />
          ))}
        </>
      ) : null}
    </div>
  );
};

export default AssigneesFilter;
