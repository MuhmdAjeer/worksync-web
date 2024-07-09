import React, { useEffect, useState } from "react";

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
import { toast } from "sonner";

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
  }, [user?.onboarding, user]);

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
