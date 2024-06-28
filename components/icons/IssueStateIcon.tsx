import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleIcon,
  CircleXIcon,
  LoaderCircle,
} from "lucide-react";
import React from "react";

export type TStateGroups =
  | "backlog"
  | "todo"
  | "inProgress"
  | "done"
  | "cancelled";

interface IssueStateIconProps {
  group: TStateGroups;
  color?: string;
  className: string;
  height?: string;
  width?: string;
}

export const STATE_GROUP_COLORS: {
  [key in TStateGroups]: string;
} = {
  backlog: "#d9d9d9",
  inProgress: "#3f76ff",
  todo: "#f59e0b",
  done: "#16a34a",
  cancelled: "#dc2626",
};

const IssueIcons = {
  backlog: CircleDashedIcon,
  todo: CircleIcon,
  inProgress: LoaderCircle,
  done: CircleCheckIcon,
  cancelled: CircleXIcon,
};

const IssueStateIcon: React.FC<IssueStateIconProps> = ({
  className = "",
  color,
  group,
  height = "12px",
  width = "12px",
}) => {
  const Icon = IssueIcons[group];
  return (
    <Icon
      height={height}
      width={width}
      color={color ?? STATE_GROUP_COLORS[group]}
      className={`flex-shrink-0 ${className}`}
    />
  );
};

export default IssueStateIcon;
