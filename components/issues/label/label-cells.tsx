import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import LabelBadge from "./label-badge";
import { IssueLabelDto } from "@/generated/dto/issue-label-dto";

export default function LabelCell({ labels }: { labels: IssueLabelDto[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const maxVisibleLabels = 2;

  return (
    <div className="flex items-center gap-1">
      {labels.slice(0, maxVisibleLabels).map((label, index) => (
        <LabelBadge key={index} label={label} />
      ))}
      {labels.length > maxVisibleLabels && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 px-2">
              +{labels.length - maxVisibleLabels}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex flex-wrap gap-1">
              {labels.slice(maxVisibleLabels).map((label, index) => (
                <LabelBadge key={index} label={label} />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
