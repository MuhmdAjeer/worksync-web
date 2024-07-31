import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface IFilterHeaderProps {
  isPreviewEnabled: boolean;
  handlePreviewEnabled: () => void;
  title: string;
}

const FilterHeader: React.FC<IFilterHeaderProps> = ({
  isPreviewEnabled,
  handlePreviewEnabled,
  title,
}) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium text-primary/50">{title}</p>
      <Button
        onClick={() => handlePreviewEnabled()}
        variant="ghost"
        className="h-6 px-1 outline-none"
      >
        {!isPreviewEnabled ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default FilterHeader;
