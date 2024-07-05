import { InvitationDto } from "@/generated/dto/invitation-dto";
import React, { useEffect, useState } from "react";
import JoinWorkspaces from "./JoinWorkspaces";
import CreateWorkspace from "./CreateWorkspace";
import { OnboardMeta } from "@/generated/dto/onboard-meta";

enum ECurrentView {
  CREATE_WORKSPACE = "CREATE_WORKSPACE",
  JOIN_WORKSPACE = "JOIN_WORKSPACE",
}

interface IProps {
  invitations?: InvitationDto[];
  changeStep: (data: OnboardMeta) => void;
  finishOnboarding: () => Promise<void>;
}

const CreateOrJoinWorkspace: React.FC<IProps> = ({
  invitations,
  changeStep,
  finishOnboarding,
}) => {
  const [currentView, setCurrentView] = useState<ECurrentView | null>(null);

  useEffect(() => {
    if (invitations?.length) {
      setCurrentView(ECurrentView.JOIN_WORKSPACE);
      return;
    }
    setCurrentView(ECurrentView.CREATE_WORKSPACE);
  }, [invitations]);

  return currentView === ECurrentView.JOIN_WORKSPACE && invitations ? (
    <JoinWorkspaces
      toggleView={() => setCurrentView(ECurrentView.CREATE_WORKSPACE)}
      invitations={invitations}
      nextStep={() => {
        finishOnboarding();
      }}
    />
  ) : (
    <CreateWorkspace
      changeStep={changeStep}
      totalInvitations={invitations?.length || 0}
      toggleView={() => setCurrentView(ECurrentView.JOIN_WORKSPACE)}
    />
  );
};

export default CreateOrJoinWorkspace;
