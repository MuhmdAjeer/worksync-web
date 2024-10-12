import { UserDto } from "@/generated/dto/user-dto";
import { QUERY_KEYS } from "@/lib/constants";
import { UserService } from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useProjectMembers } from "./projects";

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

export const useMember = (id: string) => {
  const { projectId } = useRouter().query;
  const { data: members } = useProjectMembers(projectId?.toString()!);
  if (!members) return null;
  return members.find((x) => x.user.id === id);
};
