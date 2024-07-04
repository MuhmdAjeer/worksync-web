import { QUERY_KEYS } from "@/lib/constants";
import { UserService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

const userService = new UserService();

export const useInvitations = () => {
  return useQuery({
    queryFn: async () => await userService.getInvitations(),
    queryKey: [QUERY_KEYS.GET_INVITATIONS],
  });
};
