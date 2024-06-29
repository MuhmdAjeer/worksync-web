import { CreateUserDto } from "@/generated/dto/create-user-dto";
import { VerifyOTPDto } from "@/generated/dto/verify-otpdto";
import ApiClient from "@/lib/apiClient";
import { is4xxError, isDuplicateError, isNotFoundError } from "@/lib/utils";
import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogin = (): UseMutationResult<
  { access_token: string },
  Error,
  CreateUserDto,
  unknown
> => {
  // const router = useRouter();
  const mutationOptions: UseMutationOptions<
    { access_token: string },
    Error,
    CreateUserDto,
    unknown
  > = {
    mutationFn: async (userDto: CreateUserDto) => {
      return await ApiClient.login(userDto);
    },
    onError: (error) => {
      if (is4xxError(error, 401) || isNotFoundError(error)) {
        toast.error("Invalid credentials");
      }
    },
    onSuccess(data) {
      localStorage.setItem("access_token", data.access_token);
    },
  };

  return useMutation(mutationOptions);
};
export const useRegisterUser = (): UseMutationResult<
  CreateUserDto,
  Error,
  CreateUserDto,
  unknown
> => {
  return useMutation({
    mutationFn: async (userDto: CreateUserDto) => {
      return await ApiClient.registerUser(userDto);
    },
    onError: (error) => {
      if (isDuplicateError(error)) {
        toast.error("User Already exists");
      }
    },
  });
};

export const useVerifyCode = (): UseMutationResult<
  void,
  Error,
  VerifyOTPDto,
  unknown
> => {
  const mutationOptions: UseMutationOptions<
    void,
    Error,
    VerifyOTPDto,
    unknown
  > = {
    mutationFn: async (data: VerifyOTPDto) => {
      await ApiClient.verifyToken(data);
    },
    onError: (error) => {
      if (is4xxError(error, 400)) {
        toast.error("Invalid code, Try again!");
      }
    },
  };

  return useMutation(mutationOptions);
};
