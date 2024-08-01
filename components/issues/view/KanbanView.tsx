import { motion } from "framer-motion";
import IssuePriorityIcon from "@/components/icons/IssuePriorityIcon";
import { Button } from "@/components/ui/button";
import { PriorityEnum } from "@/generated/dto/create-issue-dto";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import React, { useEffect, useRef, useState } from "react";
import { useProjectIssues, useUpdateIssue } from "@/hooks/issue";
import { useAppRouter } from "@/hooks/router";
import { IssueDto } from "@/generated/dto/issue-dto";
import { useProjectStates } from "@/hooks/projects";
import { IssueStateDto } from "@/generated/dto/issue-state-dto";
import IssueStateIcon from "@/components/icons/IssueStateIcon";
import {
  BaseEventPayload,
  DragLocationHistory,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

const KanbanView = () => {
  const { projectId } = useAppRouter();
  const { data: issues } = useProjectIssues(projectId!, {});
  const { data: states } = useProjectStates(projectId!);
  const { mutateAsync } = useUpdateIssue();
  const [myIssues, setMyIssues] = useState(issues?.data);

  useEffect(() => {
    setMyIssues(issues?.data);
  }, [issues]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          return;
        }
        const issue = source.data.issue as IssueDto;
        if (issue?.id === undefined) return;

        setMyIssues((prev) =>
          prev?.map((x) => {
            return x.id === issue.id
              ? {
                  ...x,
                  state: location.current.dropTargets[0].data
                    .state as IssueStateDto,
                }
              : x;
          })
        );

        try {
          mutateAsync({
            issueId: issue.id,
            projectId: projectId!,
            state: location.current.dropTargets[0].data?.state?.id as string,
          }).then(() => {});
        } catch (error) {}
      },
    });
  }, [issues]);

  if (!states || !issues || !myIssues) return null;
  return (
    <div className="flex h-full">
      {states.map((state) => (
        <IssueBoard key={state.id} state={state} issues={myIssues} />
      ))}
    </div>
  );
};

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
  }, []);

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

interface IssueBoardProps {
  issues: IssueDto[];
  state: IssueStateDto;
}

const IssueBoard: React.FC<IssueBoardProps> = ({ issues, state }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const stateIssues = issues?.filter((issue) => issue.state?.id === state.id);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
      getData: () => ({ state: state }),
      getIsSticky: () => true,
    });
  }, []);
  return (
    <motion.div
      layout
      className="w-[350px] bg-secondary/20 h-full p-2 mx-2 rounded-lg"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex  items-center gap-2">
          <IssueStateIcon className="h-5 w-5" group={state.group} />
          <h1 className="font-black text-xs ">{state.name}</h1>
          <h6 className="text-secondary text-xs">2</h6>
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

      {stateIssues.map((x) => (
        <IssueCard key={x.id} issue={x} />
      ))}
      {isDraggedOver && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="my-2 bg-secondary/5 h-24 ">
            <CardHeader>
              <CardTitle></CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default KanbanView;
