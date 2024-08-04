import React, { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import get from "lodash/get";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useProjectIssues, useUpdateIssue } from "@/hooks/issue";
import { useAppRouter } from "@/hooks/router";
import { useProjectStates } from "@/hooks/projects";
import IssuePriorityIcon from "@/components/icons/IssuePriorityIcon";
import IssueStateIcon from "@/components/icons/IssueStateIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { CreateIssueDto, PriorityEnum } from "@/generated/dto/create-issue-dto";
import { IssueDto } from "@/generated/dto/issue-dto";
import { IssueStateDto } from "@/generated/dto/issue-state-dto";
import { EIssueGroupBy } from "@/pages/[workspaceSlug]/projects/[projectId]/issues";
import {
  BaseEventPayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { toast } from "sonner";

export const ISSUE_GROUP_BY_KEYS: Record<TIssueGroupByOptions, string> = {
  assignees: "assignees",
  created_by: "issued_by",
  priority: "priority",
  state: "state.id",
};

interface I {
  key: keyof typeof ISSUE_GROUP_BY_KEYS;
  id: string;
  title: string;
  icon?: ReactNode;
  payload: Partial<CreateIssueDto>;
}

export type TIssueGroupByOptions =
  | "state"
  | "priority"
  | "created_by"
  | "assignees";

const getGroupColumns = (
  groupBy: TIssueGroupByOptions,
  states?: IssueStateDto[]
): I[] | undefined => {
  if (groupBy === "state" && states) {
    return states.map((state) => ({
      key: "state",
      id: state.id,
      title: state.name,
      icon: <IssueStateIcon group={state.group} />,
      payload: { state: state.id },
    }));
  }

  if (groupBy === "priority") {
    return Object.values(PriorityEnum).map((priority) => ({
      id: priority,
      key: "priority",
      title: priority,
      icon: <IssuePriorityIcon group={priority} />,
      payload: { priority },
    }));
  }
};

interface IKanbanView {
  groupBy: TIssueGroupByOptions;
}

export type TGroupedIssues = Record<string, IssueDto[]>;

const getGroupByKeys = (
  groupBy: TIssueGroupByOptions,
  states?: IssueStateDto[]
): string[] => {
  if (groupBy === "priority") {
    return Object.values(PriorityEnum);
  }
  if (groupBy === "state" && states) {
    return states.map((state) => state.id);
  }
  return [];
};

const getGroupedIssues = (
  groupBy: TIssueGroupByOptions,
  issues?: IssueDto[],
  states?: IssueStateDto[]
): TGroupedIssues => {
  const groupedIssues: TGroupedIssues = {};

  if (!issues) return groupedIssues;

  const groupKeys = getGroupByKeys(groupBy, states);
  console.log({ groupKeys, groupBy });

  groupKeys.forEach((group) => {
    groupedIssues[group] = [];
  });

  for (const issue of issues) {
    const issueKey = get(issue, ISSUE_GROUP_BY_KEYS[groupBy]);
    if (issueKey) {
      if (!groupedIssues[issueKey]) {
        groupedIssues[issueKey] = [];
      }
      groupedIssues[issueKey].push(issue);
    }
  }

  console.log({ groupedIssues });
  return groupedIssues;
};

const KanbanView: React.FC<IKanbanView> = ({ groupBy }) => {
  const { projectId } = useAppRouter();
  const { data: issuesData } = useProjectIssues(projectId!, {});
  const { data: states } = useProjectStates(projectId!);
  const { mutateAsync } = useUpdateIssue();

  const [groupedIssues, setGroupedIssues] = useState<TGroupedIssues>({});

  useEffect(() => {
    if (issuesData?.data) {
      const initialGroupedIssues = getGroupedIssues(
        groupBy,
        issuesData.data,
        states
      );
      setGroupedIssues(initialGroupedIssues);
    }
  }, [issuesData?.data, groupBy, states]);

  useEffect(() => {
    const handleDrop = ({
      location,
      source,
    }: BaseEventPayload<ElementDragType>) => {
      const destination = location.current.dropTargets[0]?.data;
      if (!destination) return;

      const issue = source.data.issue as IssueDto;
      if (!issue?.id) return;

      const sourceKey = get(issue, ISSUE_GROUP_BY_KEYS[groupBy]);
      const destinationKey = destination[groupBy] as string;

      // console.log({ sourceKey, destination: destination[groupBy] });

      setGroupedIssues((prevIssues) => {
        if (!sourceKey || !destinationKey) return prevIssues;

        const newSourceGroup =
          prevIssues[sourceKey]?.filter((i) => i.id !== issue.id) || [];

        const newDestinationGroup = [...prevIssues[destinationKey], issue];

        return {
          ...prevIssues,
          [sourceKey]: newSourceGroup,
          [destinationKey]: newDestinationGroup,
        };
      });

      mutateAsync({
        issueId: issue.id,
        projectId: projectId!,
        ...destination,
      }).catch((error) => {
        toast.error("Failed to update issue");
      });
    };

    return monitorForElements({ onDrop: handleDrop });
  }, [groupBy, mutateAsync, projectId]);

  const lists = getGroupColumns(groupBy, states);

  if (!states || !issuesData?.data || !groupedIssues) return null;

  return (
    <div className="flex h-full">
      {lists &&
        lists.map((list) => (
          <IssueBoard key={list.id} issues={groupedIssues} list={list} />
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

export default KanbanView;
