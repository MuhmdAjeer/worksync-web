import React, { useState } from "react";
import Typography from "../ui/Typography";
import InvitationsList from "../workspace/invitation/InivtationsList";
import { Button } from "../ui/button";
import { InvitationDto } from "@/generated/dto/invitation-dto";
import { useAcceptInvitations } from "@/hooks/invitations";
import WorkspaceLogo from "../workspace/workspaceLogo";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";

interface IProps {
  invitations: InvitationDto[];
  toggleView: () => void;
  nextStep: () => void;
}

const JoinWorkspaces = ({ invitations, toggleView, nextStep }: IProps) => {
  const [acceptedInvites, setAcceptedInvites] = useState<string[]>([]);

  const { mutate: acceptInvitation } = useAcceptInvitations();

  const handleSelection = (inviteId: string, action: "accept" | "decline") => {
    if (action === "accept") {
      setAcceptedInvites((prev) => [...prev, inviteId]);
    }
    if (action === "decline") {
      setAcceptedInvites((prev) => prev.filter((v) => v !== inviteId));
    }
  };

  const handleJoinWorkspace = () => {
    acceptInvitation(
      { invitations: acceptedInvites },
      {
        onSuccess: () => {
          toast.success("Successfully joined workspaces");
          nextStep();
        },
        onError: () => {
          toast.error("Failed to join workspaces");
        },
      }
    );
  };

  return (
    <div className="w-full">
      <Typography variant="h3" className="mb-4">
        You have invitations to join workspaces!
      </Typography>
      <div className="flex flex-col gap-4">
        {invitations.map((invitation) => {
          const selected = acceptedInvites.includes(invitation.id);
          return (
            <div
              onClick={(e) => {
                e.stopPropagation();
                console.log({ selected });

                handleSelection(invitation.id, selected ? "decline" : "accept");
              }}
              className=" rounded border-primary/10 border p-2 hover:border-primary/20 hover:bg-primary-foreground/50"
            >
              <div className="flex flex-row justify-between px-1 items-center cursor-pointer">
                <div className="flex flex-row items-center gap-4">
                  <WorkspaceLogo name={invitation.workspace.name} />
                  <div>
                    <Typography variant="h4">
                      {invitation.workspace.name}
                    </Typography>
                    <Typography affects="removePMargin" variant="h6">
                      {invitation.role}
                    </Typography>
                  </div>
                </div>
                <Checkbox
                  checked={selected}
                  id={invitation.id}
                  className="h-6 w-6"
                />
              </div>
            </div>
          );
        })}
        <Button onClick={handleJoinWorkspace} className="w-full">
          Join{" "}
        </Button>
      </div>
      <div className="mx-auto flex items-center w-full">
        <hr className="w-full border-secondary" />
        <p className="mx-3 text-primary/50">or</p>
        <hr className="w-full border-secondary" />
      </div>
      <Button onClick={toggleView} className="w-full" variant="secondary">
        Create your own workspace
      </Button>
    </div>
  );
};

export default JoinWorkspaces;
