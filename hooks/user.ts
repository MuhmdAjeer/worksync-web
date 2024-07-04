import { UserDto } from "@/generated/dto/user-dto";
import { QUERY_KEYS } from "@/lib/constants";
import { UserService } from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const userService = new UserService();

export const useUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: async () => await userService.getCurrentUser(),
  });
};

export const useUpdateUser = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<UserDto>) =>
      await userService.updateProfile(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
    },
  });
};
