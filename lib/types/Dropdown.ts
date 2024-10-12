import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

export interface IDropdownProps {
  label: string;
  button?: ReactNode;
  dropdownArrow?: boolean;
  showIcons?: boolean;
  buttonClassName?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
  buttonSize?: VariantProps<typeof buttonVariants>["size"];
}
