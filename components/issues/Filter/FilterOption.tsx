import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ReactNode } from "react";

interface IOption {
  handleSelect: () => void;
  isSelected: boolean;
  icon: ReactNode;
  title: string;
}

const FilterOption: React.FC<IOption> = ({
  handleSelect,
  isSelected,
  icon,
  title,
}) => {
  return (
    <Button
      onClick={() => {
        handleSelect();
      }}
      type="button"
      size="sm"
      variant="ghost"
      className="flex w-full justify-normal h-7 items-center gap-2  m-0 px-2 rounded "
    >
      <Checkbox className="" checked={isSelected} />
      {icon}
      <span className="text-xs font-medium">{title}</span>
    </Button>
  );
};

export default FilterOption;
