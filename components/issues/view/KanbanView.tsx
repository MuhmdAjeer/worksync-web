import React, { useEffect, useState } from "react";
import get from "lodash/get";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useProjectIssues, useUpdateIssue } from "@/hooks/issue";
import { useAppRouter } from "@/hooks/router";
import { useProjectStates } from "@/hooks/projects";
import { IssueDto } from "@/generated/dto/issue-dto";
import {
  BaseEventPayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { toast } from "sonner";
import { TGroupedIssues, TIssueGroupByOptions } from "@/lib/types/issue";
import IssueBoard from "../kanban/IssueBoard";
import {
  ISSUE_GROUP_BY_KEYS,
  getGroupColumns,
  getGroupedIssues,
} from "@/lib/kanban-utils";

interface IKanbanView {
  groupBy: TIssueGroupByOptions;
}

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

export default KanbanView;
