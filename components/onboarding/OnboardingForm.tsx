"use client";
import { onboardingSchema } from "@/lib/schema/Workspace";
import { OnboardingWorkspace } from "@/lib/types/Workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Typography from "../ui/Typography";
import FileInput from "../ui/FileInput";
import { cn } from "@/lib/utils";
import InviteMemberInput, { Field } from "../InviteMemberInput";
import { OnboardDto } from "@/generated/dto/onboard-dto";
import { UseOnboardUser } from "@/hooks/Onboard";
import ApiClient from "@/lib/apiClient";
import { TypeEnum } from "@/generated/dto/file-upload-request-dto";
import { useWorkspaceStore } from "@/hooks/store/workspace";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";
import { useInvitations } from "@/hooks/invitations";
import { OnboardMeta } from "@/generated/dto/onboard-meta";
import { useUpdateUser, useUser } from "@/hooks/user";
import ProfileSetup from "./ProfileSetup";
import CreateOrJoinWorkspace from "./CreateOrJoinWorkspace";
import InviteMembers from "./InviteMembers";
import { useWorkspaces } from "@/hooks/workspaces";
import { AnimatePresence, motion } from "framer-motion";

export enum EOnboardingSteps {
  PROFILE_SETUP = "PROFILE_SETUP",
  WORKSPACE_CREATE_OR_JOIN = "WORKSPACE_CREATE_OR_JOIN",
  INVITE_MEMBERS = "INVITE_MEMBERS",
}

const transitionVariants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

const OnboardingForm = observer(() => {
  const [step, setStep] = useState<EOnboardingSteps | null>(null);
  const { data: user } = useUser();
  const { mutateAsync: updateProfile } = useUpdateUser();
  const { data: workspaceInvitations } = useInvitations();
  const { data: workspaces } = useWorkspaces();

  const router = useRouter();

  const changeStep = async (steps: OnboardMeta) => {
    const data = {
      ...user?.onboarding,
      ...steps,
    };
    await updateProfile({ onboarding: data });
  };

  const finishOnboarding = async () => {
    if (!workspaces || !user) return;
    const lastWorkspace = workspaces[0];
    updateProfile({
      onboarding: {
        profile_complete: true,
        workspace_create: true,
        workspace_invite: true,
        workspace_join: true,
        is_onboarded: true,
      },
    }).then((res) => {
      toast.success("Onboarding completed!");
      router.push(`${lastWorkspace.name}`);
    });
  };

  useEffect(() => {
    if (!user) return;

    const handleStepChange = async () => {
      if (!user) return;

      const onboardingStep = user.onboarding;

      if (!onboardingStep) return;

      if (!onboardingStep.profile_complete)
        setStep(EOnboardingSteps.PROFILE_SETUP);

      if (
        onboardingStep.profile_complete &&
        !(onboardingStep.workspace_join || onboardingStep.workspace_create)
      ) {
        setStep(EOnboardingSteps.WORKSPACE_CREATE_OR_JOIN);
      }

      if (
        onboardingStep.profile_complete &&
        (onboardingStep.workspace_join || onboardingStep.workspace_create) &&
        !onboardingStep.workspace_invite
      )
        setStep(EOnboardingSteps.INVITE_MEMBERS);
    };

    handleStepChange();
  }, [user?.onboarding]);

  return (
    <div className="flex gap-4 flex-col">
      <AnimatePresence mode="wait">
        {step === EOnboardingSteps.WORKSPACE_CREATE_OR_JOIN && (
          <motion.div
            key={EOnboardingSteps.WORKSPACE_CREATE_OR_JOIN}
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <CreateOrJoinWorkspace
              changeStep={changeStep}
              invitations={workspaceInvitations}
              finishOnboarding={finishOnboarding}
            />
          </motion.div>
        )}

        {step === EOnboardingSteps.PROFILE_SETUP && (
          <motion.div
            key={EOnboardingSteps.PROFILE_SETUP}
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <ProfileSetup changeStep={changeStep} />
          </motion.div>
        )}

        {step === EOnboardingSteps.INVITE_MEMBERS && (
          <motion.div
            key={EOnboardingSteps.INVITE_MEMBERS}
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <InviteMembers
              workspace={workspaces?.[0]}
              finishOnboarding={finishOnboarding}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default OnboardingForm;
