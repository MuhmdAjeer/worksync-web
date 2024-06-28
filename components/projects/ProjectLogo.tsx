import { cn } from "@/lib/utils";
import React from "react";

interface IProps {
  value?: string;
  className?: string;
}

const ProjectLogo: React.FC<IProps> = ({ className, value }) => {
  return (
    <span className={cn("text-base text-center", className)}>
      {value
        ?.split("-")
        .map((emoji) => String.fromCodePoint(parseInt(emoji, 10)))}
    </span>
  );
};

export default ProjectLogo;
