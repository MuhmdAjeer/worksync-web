import { cn } from "@/lib/utils";
import React from "react";

interface Stack
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export const CStack: React.FC<Stack> = ({ className, ...props }) => {
  return (
    <div {...props} className={cn("flex flex-col items-center", className)}>
      {props.children}
    </div>
  );
};

export const RStack: React.FC<Stack> = ({ className, ...props }) => {
  return (
    <div {...props} className={cn("flex flex-row items-center gap-2", className)}>
      {props.children}
    </div>
  );
};
