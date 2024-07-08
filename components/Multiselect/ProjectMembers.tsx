import React, { useMemo, useState } from "react";
import { MultiSelect, OptionType } from ".";
import { useProjectMembers } from "@/hooks/projects";
import { useWorkspaceMembers } from "@/hooks/workspaces";
import { useAppRouter } from "@/hooks/router";

interface IProps {
  projectId: string;
  onChange: (value: string[]) => void;
  label: string;
  value: string[];
}

const ProjectMembersDropdown: React.FC<IProps> = (props) => {
  const { projectId, onChange, label, value } = props;

  const { data: members } = useProjectMembers(projectId);

  if (!members) return null;

  const options: OptionType[] = members.map((x) => {
    return { label: x.user.username ?? "", value: x.id };
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
