import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IssueDto } from "@/generated/dto/issue-dto";

interface IssueCardProps {
  issue: IssueDto;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      getInitialData: () => ({ issue: issue }),
    });
  }, [issue]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card
        ref={ref}
        style={dragging ? { display: "none" } : {}}
        className="my-2 bg-secondary/50"
      >
        <CardHeader>
          <CardTitle>{issue.title}</CardTitle>
          <CardDescription>{issue.description}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default IssueCard;
