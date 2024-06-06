import React, { FC, PropsWithChildren } from "react";
import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IProps extends PropsWithChildren {
  title: string | React.ReactNode;
  side?: "top" | "right" | "left" | "bottom";
}

const Tooltip: FC<IProps> = ({ side = "bottom", title, children }) => {
  return (
    <ShadTooltip delayDuration={0}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        <p>{title}</p>
      </TooltipContent>
    </ShadTooltip>
  );
};

export default Tooltip;
