import * as React from "react";

import { cn } from "@/lib/utils";
import Typography from "./Typography";
import { Label } from "./label";
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  message?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {props.message && (
          <Typography affects={"small"} className="text-red-500 ">
            {props.message}
          </Typography>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
