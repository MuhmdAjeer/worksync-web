import { OnboardDto } from "@/generated/dto/onboard-dto";
import { Workspace } from "@/generated/dto/workspace";
import ApiClient from "@/lib/apiClient";
import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const UseOnboardUser = (): UseMutationResult<
  Workspace,
  Error,
  OnboardDto,
  unknown
> => {
  return useMutation({
    mutationFn: async (userDto: OnboardDto) => {
      return await ApiClient.onboardUser(userDto);
    },
    onError: (error) => {
      toast.error("Error");
    },
  });
};
