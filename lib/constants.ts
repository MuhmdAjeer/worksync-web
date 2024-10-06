import { PriorityEnum } from "@/generated/dto/create-issue-dto";
import { GroupEnum } from "@/generated/dto/issue-state-dto";

export const PROJECT_UNSPLASH_COVERS = [
  "https://images.unsplash.com/photo-1531045535792-b515d59c3d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1693027407934-e3aa8a54c7ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1464925257126-6450e871c667?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1606768666853-403c90a981ad?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1643330683233-ff2ac89b002c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1475738972911-5b44ce984c42?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1673393058808-50e9baaf4d2c?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1696643830146-44a8755f1905?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1693868769698-6c7440636a09?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1691230995681-480d86cbc135?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1675351066828-6fc770b90dd2?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
];
export enum QUERY_KEYS {
  GET_PROJECT_LABELS = "GET_PROJECT_LABELS",
  GET_WORKSPACE = "GET_WORKSPACE",
  GET_MY_WORKSPACES = "GET_MY_WORKSPACES",
  GET_WORKSPACE_PROJECTS = "GET_WORKSPACE_PROJECTS",
  GET_MY_PROJECTS = "GET_MY_PROJECTS ",

  GET_CURRENT_USER = "GET_CURRENT_USER",
  GET_INVITATIONS = "GET_INVITATIONS",
  UPLOAD_FILE = "UPLOAD_FILE",
  GET_WORKSPACE_MEMBERS = "GET_WORKSPACE_MEMBERS",
  GET_PROJECT = "GET_PROJECT",
  GET_PROJECT_ISSUES = "GET_PROJECT_ISSUES",
  GET_PROJECT_ISSUES_INFINITE = "GET_PROJECT_ISSUES_INFINITE",
  GET_PROJECT_STATES = "GET_PROJECT_STATES",
  GET_PROJECT_MEMBERS = "GET_PROJECT_MEMBERS",
  GET_ALL_INVITATIONS = "GET_ALL_INVITATIONS",
}

export const STATE_GROUP_COLORS: {
  [key in GroupEnum]: string;
} = {
  backlog: "#d9d9d9",
  started: "#3f76ff",
  unstarted: "#f59e0b",
  completed: "#16a34a",
  cancelled: "#dc2626",
};

export const PRIORITY_GROUP_COLORS: {
  [key in PriorityEnum]: string;
} = {
  High: " text-orange-300",
  Urgent: "text-destructive",
  Low: " text-blue-300 ",
  Medium: "text-yellow-500 ",
  None: "text-primary/50",
};
