import { GroupEnum } from "@/generated/dto/issue-state-dto";
import { STATE_GROUP_COLORS } from "@/lib/constants";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleIcon,
  CircleXIcon,
  LoaderCircle,
} from "lucide-react";
import React, { ReactElement, ReactNode } from "react";

interface IssueStateIconProps {
  group: GroupEnum;
  color?: string;
  className?: string;
  height?: string;
  width?: string;
}

const IssueIcons: {[key in GroupEnum]: any;} = {
  backlog: CircleDashedIcon,
  unstarted: CircleIcon,
  started: LoaderCircle,
  completed: CircleCheckIcon,
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
