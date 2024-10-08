import { Badge } from "@/components/ui/badge";
import { IssueLabelDto } from "@/generated/dto/issue-label-dto";

export default function LabelBadge({ label }: { label: IssueLabelDto }) {
  return (
    <Badge
      variant="outline"
      style={{
        backgroundColor: `${label.color}20`,
        color: label.color,
        borderColor: label.color,
      }}
    >
      {label.name}
    </Badge>
  );
}
