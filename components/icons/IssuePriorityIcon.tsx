import { PriorityEnum } from "@/generated/dto/create-issue-dto";
import { PRIORITY_GROUP_COLORS, STATE_GROUP_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  AlertOctagonIcon,
  CircleXIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
} from "lucide-react";
import React from "react";

interface IssuePriorityIconProps {
  group: PriorityEnum;
  color?: string;
  className?: string;
  height?: string;
  width?: string;
}

const IssueIcons: { [key in PriorityEnum]: any } = {
  High: SignalHighIcon,
  Low: SignalLowIcon,
  Medium: SignalMediumIcon,
  None: CircleXIcon,
  Urgent: AlertOctagonIcon,
};

const IssuePriorityIcon: React.FC<IssuePriorityIconProps> = ({
  className = "",
  color,
  group,
  height = "16px",
  width = "16px",
}) => {
  const Icon = IssueIcons[group];
  return (
    <Icon
      height={height}
      width={width}
      //   color={color ?? STATE_GROUP_COLORS[group]}
      className={cn(`flex-shrink-0`, className, PRIORITY_GROUP_COLORS[group])}
    />
  );
};

export default IssuePriorityIcon;
