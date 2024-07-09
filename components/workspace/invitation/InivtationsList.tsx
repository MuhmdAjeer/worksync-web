import { InvitationDto } from "@/generated/dto/invitation-dto";
import React from "react";
import WorkspaceLogo from "../workspaceLogo";
import Typography from "@/components/ui/Typography";
import { Checkbox } from "@/components/ui/checkbox";

interface IProps {
  invitations: InvitationDto[];
}

const InvitationsList = ({ invitations }: IProps) => {
  return invitations.map((invitation) => (
    <div
      key={invitation.id}
      className=" rounded border-primary/10 border p-2 hover:border-primary/20 hover:bg-primary-foreground/50"
    >
      <label
        htmlFor={invitation.id}
        className="flex flex-row justify-between px-1 items-center cursor-pointer"
      >
        <div className="flex flex-row items-center gap-4">
          <WorkspaceLogo name={invitation.workspace.name} />
          <div>
            <Typography variant="h4">{invitation.workspace.name}</Typography>
            <Typography affects="removePMargin" variant="h6">
              {invitation.role}
            </Typography>
          </div>
        </div>
        <Checkbox id={invitation.id} className="h-6 w-6" />
      </label>
    </div>
  ));
};

export default InvitationsList;
