import { CreateUserDto } from "@/generated/dto/create-user-dto";
import { z, ZodType } from "zod";

export const registerSchema: ZodType<CreateUserDto> = z.object({
  email: z.string().email(),
  password: z.string(),
});
export const loginSchema: ZodType<CreateUserDto> = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Must contain at least 8 characters"),
});
