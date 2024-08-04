import { IssueStateDto } from "@/generated/dto/issue-state-dto";
import { I, TGroupedIssues, TIssueGroupByOptions } from "./types/issue";
import { IssueDto } from "@/generated/dto/issue-dto";
import { PriorityEnum } from "@/generated/dto/create-issue-dto";
import IssuePriorityIcon from "@/components/icons/IssuePriorityIcon";
import IssueStateIcon from "@/components/icons/IssueStateIcon";
import { get } from "lodash";

export const ISSUE_GROUP_BY_KEYS: Record<TIssueGroupByOptions, string> = {
  assignees: "assignees",
  created_by: "issued_by",
  priority: "priority",
  state: "state.id",
};

export const getGroupColumns = (
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

export const getGroupByKeys = (
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

export const getGroupedIssues = (
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
