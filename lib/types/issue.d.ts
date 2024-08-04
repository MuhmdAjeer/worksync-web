export interface I {
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

export type TGroupedIssues = Record<string, IssueDto[]>;
