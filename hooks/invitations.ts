import { AcceptInvitationsDto } from "@/generated/dto/accept-invitations-dto";
import { InvitationQuery } from "@/generated/dto/invitation-query";
import { UpdateInvitationDto } from "@/generated/dto/update-invitation-dto";
import { QUERY_KEYS } from "@/lib/constants";
import { UserService } from "@/services/user.service";
import { WorkspaceService } from "@/services/workspace.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const userService = new UserService();
const workspaceService = new WorkspaceService();

export const useInvitations = () => {
  return useQuery({
    queryFn: async () => await userService.getInvitations(),
    queryKey: [QUERY_KEYS.GET_INVITATIONS],
  });
};

export const useAcceptInvitations = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (data: AcceptInvitationsDto) =>
      await userService.acceptInvites(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEYS.GET_MY_WORKSPACES] });
    },
  });
};

export const useInvitationsList = (slug: string, query: InvitationQuery) => {
  return useQuery({
    queryFn: async () => await workspaceService.getInvitations(slug, query),
    queryKey: [QUERY_KEYS.GET_ALL_INVITATIONS, query, slug],
  });
};

export const useUpdateInvitation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      slug,
      data,
    }: {
      id: string;
      slug: string;
      data: UpdateInvitationDto;
    }) => await workspaceService.updateInvitatioon(id, slug, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_INVITATIONS] });
    },
  });
};

export const useRemoveInvitation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, slug }: { id: string; slug: string }) =>
      await workspaceService.removeInvitation(id, slug),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_INVITATIONS] });
    },
  });
};
