import React from "react";
import Typography from "../ui/Typography";
import InvitationsList from "../workspace/invitation/InivtationsList";
import { Button } from "../ui/button";
import { InvitationDto } from "@/generated/dto/invitation-dto";

interface IProps {
  invitations: InvitationDto[];
  toggleView: () => void;
}

const JoinWorkspaces = ({ invitations, toggleView }: IProps) => {
  return (
    <div className="w-full">
      <Typography variant="h3" className="mb-4">
        You have invitations to join workspaces!
      </Typography>
      <div className="flex flex-col gap-4">
        <InvitationsList invitations={invitations} />
        <Button className="w-full">Continue to workspace</Button>
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
