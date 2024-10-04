import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface IProps {
  isActive: boolean;
  children: ReactNode;
}

const MenuItem: React.FC<IProps> = ({ isActive, children }) => {
  return (
    <div
      className={cn(
        "rounded-sm px text-custom-primary-dark w-full flex items-center justify-between gap-1.5 outline-none text-sm font-medium px-4 py-2 hover:bg-secondary cursor-pointer",
        isActive
          ? "bg-custom-primary-light/10 text-custom-primary-dark"
          : "text-primary",
      )}
    >
      {children}
    </div>
  );
};

export default MenuItem;
