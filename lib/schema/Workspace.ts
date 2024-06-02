import { ZodType, string, z } from "zod";
import { Member, OnboardingWorkspace } from "../types/Workspace";
import { CreateWorkspaceDto } from "@/generated/dto/create-workspace-dto";
import { OnboardDto } from "@/generated/dto/onboard-dto";

const memberSchema: ZodType<Member> = z.object({
  email: z.string(),
  role: z.string(),
});
export const onboardingSchema: ZodType<OnboardDto> = z.object({
  name: z.string(),
  slug: z.string(),
  members: z.array(memberSchema),
  profile_picture: z.string(),
  user_name: z.string(),
  use: z.string(),
  workspace_use: z.string(),
});
