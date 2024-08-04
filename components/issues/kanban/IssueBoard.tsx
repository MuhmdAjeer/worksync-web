import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { I, TGroupedIssues } from "@/lib/types/issue";
import IssueCard from "./IssueCard";

interface IssueBoardProps {
  issues: TGroupedIssues;
  list: I;
}

const IssueBoard: React.FC<IssueBoardProps> = ({ issues, list }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const stateIssues = issues[list.id] || [];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
      getData: () => ({ ...list.payload }),
      getIsSticky: () => true,
    });
  }, [list]);

  return (
    <motion.div
      layout
      className={`w-[350px] bg-secondary/20 h-full p-2 mx-2 rounded-lg ${
        isDraggedOver ? "border-dashed border-2 border-primary" : ""
      }`}
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {list.icon}
          <h1 className="font-black text-xs">{list.title}</h1>
          <h6 className="text-secondary text-xs">{stateIssues.length}</h6>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="xs">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="xs">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {stateIssues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </motion.div>
  );
};

export default IssueBoard;
