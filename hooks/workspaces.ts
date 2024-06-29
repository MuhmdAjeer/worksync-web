import { QUERY_KEYS } from "@/lib/constants";
import { WorkspaceService } from "@/services/workspace.service";
import { useQuery } from "@tanstack/react-query";
import { useAppRouter } from "./router";
import { useWorkspaceStore } from "./store/workspace";

const workspaceService = new WorkspaceService();

export const useWorkspace = (workspaceSlug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_WORKSPACE, workspaceSlug],
    queryFn: async () => await workspaceService.fetchWorkspace(workspaceSlug!),
    enabled: !!workspaceSlug,
  });
};

export const useWorkspaces = () => {
  const { fetchMyWorkspaces } = useWorkspaceStore();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MY_WORKSPACES],
    queryFn: async () => await fetchMyWorkspaces(),
  });
};
