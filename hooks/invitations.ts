import { AcceptInvitationsDto } from "@/generated/dto/accept-invitations-dto";
import { QUERY_KEYS } from "@/lib/constants";
import { UserService } from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const userService = new UserService();

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
