import { QUERY_KEYS } from "@/lib/constants";
import { WorkspaceService } from "@/services/workspace.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppRouter } from "./router";
import { useWorkspaceStore } from "./store/workspace";
import { CreateWorkspaceDto } from "@/generated/dto/create-workspace-dto";
import { InviteMembersDto } from "@/generated/dto/invite-members-dto";
import { is4xxError } from "@/lib/utils";
import { toast } from "sonner";

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

export const useCreateWorkspace = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateWorkspaceDto) =>
      await workspaceService.createWorkspace(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEYS.GET_MY_WORKSPACES] });
    },
  });
};

export const useInviteMembers = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (params: { slug: string; data: InviteMembersDto }) =>
      await workspaceService.inviteMembers(params.slug, params.data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEYS.GET_WORKSPACE] });
    },
    onError(error, variables, context) {
      if (is4xxError(error, 409)) {
        toast.error("One of the user is already a member");
      }
    },
  });
};

export const useWorkspaceMembers = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_WORKSPACE_MEMBERS, slug],
    queryFn: async () => await workspaceService.getMembers(slug),
    enabled: !!slug,
  });
};
