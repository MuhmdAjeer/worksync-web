import React, { useMemo, useState } from "react";
import { MultiSelect } from ".";
import { useProjectMembers } from "@/hooks/projects";
import { OptionType } from "../IssueFilterDropdown";

interface IProps {
  projectId: string;
  onChange: (value: string[]) => void;
  label: string;
  value: string[];
}

const ProjectMembersDropdown: React.FC<IProps> = (props) => {
  const { projectId, onChange, label, value } = props;
  console.log({ state: value });

  const { data: members } = useProjectMembers(projectId);

  if (!members) return null;

  const options: OptionType[] = members.map((x) => {
    return { label: x.user.username ?? "", value: x.user.id };
  });

  return (
    <MultiSelect
      value={value}
      onChange={onChange}
      options={options ?? []}
      label={label}
    />
  );
};

export default ProjectMembersDropdown;
