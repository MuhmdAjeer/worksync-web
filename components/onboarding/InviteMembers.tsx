import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import InviteMemberInput from "../InviteMemberInput";
import { Button } from "../ui/button";
import { WorkspaceDto } from "@/generated/dto/workspace-dto";
import { useInviteMembers } from "@/hooks/workspaces";
import { is4xxError } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "../Spinner/Spinner";
import { EUserWorkspaceRoles } from "@/lib/types/Workspace";
import { RoleEnum } from "@/generated/dto/invite-member-dto";

export interface FormValues {
  emails: IField[];
}

interface IField {
  email: string;
  role: RoleEnum;
}

interface IProps {
  finishOnboarding: () => void;
  workspace?: WorkspaceDto;
}

const InviteMembers: React.FC<IProps> = ({ finishOnboarding, workspace }) => {
  const {
    control,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm<FormValues>();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "emails",
  });
  const { mutate: inviteMembers } = useInviteMembers();

  const appendField = () => {
    append({ email: "", role: RoleEnum.Admin });
  };

  const handleInvite = async (data: FormValues) => {
    if (!workspace) return;
    inviteMembers(
      { slug: workspace.name, data },
      {
        onSuccess: () => {
          finishOnboarding();
        },
      }
    );
  };

  useEffect(() => {
    if (fields.length === 0) {
      append(
        [
          { email: "muhdajeer@gmail.com", role: RoleEnum.Admin },
          { email: "muhmdajeer.dev@gmail.com", role: RoleEnum.Admin },
          { email: "", role: RoleEnum.Admin },
        ],
        {
          focusIndex: 0,
        }
      );
    }
  }, [fields, append]);

  return (
    <form onSubmit={handleSubmit(handleInvite)}>
      {fields.map((field, index) => (
        <InviteMemberInput
          watch={watch}
          getValues={getValues}
          setValue={setValue}
          control={control}
          errors={errors}
          field={field}
          fields={fields}
          index={index}
          remove={remove}
          key={field.id}
        />
      ))}
      <Button
        onClick={() => {
          appendField();
        }}
        variant="link"
      >
        + Add another
      </Button>
      <div className="flex flex-col gap-1 w-full">
        <Button
          className="w-full"
          disabled={!isValid || isSubmitting}
          type="submit"
        >
          {isSubmitting ? <Spinner /> : "Invite Members"}
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={finishOnboarding}
          variant="link"
        >
          Ill do it later
        </Button>
      </div>
    </form>
  );
};

export default InviteMembers;
