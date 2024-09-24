import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import InviteMemberInput from "../InviteMemberInput";
import { useFieldArray, useForm } from "react-hook-form";
import { FormValues } from "../onboarding/InviteMembers";
import { useInviteMembers } from "@/hooks/workspaces";
import { RoleEnum } from "@/generated/dto/invitation-dto";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

interface IProps {
  open: boolean;
  onClose: () => void;
  workspace?: string;
}

const InviteMemberModal: React.FC<IProps> = ({ onClose, open, workspace }) => {
  const {
    control,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "emails",
  });
  const { mutate: inviteMembers, isPending } = useInviteMembers();

  const appendField = () => {
    if (fields.length === 8) {
      toast.warning("Maximum number of field limit reached!");
      return;
    }

    append({ email: "", role: RoleEnum.Admin });
  };

  const handleInvite = async (data: FormValues) => {
    if (!workspace) return;

    inviteMembers(
      { slug: workspace, data },
      {
        onSuccess: () => {
          onClose();
          toast.success("Invited Member successfully! ");
        },
      },
    )
			// .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (fields.length === 0) {
      append([{ email: "", role: RoleEnum.Admin }], {
        focusIndex: 0,
      });
    }
  }, [fields, append]);

  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[40%]">
        <DialogHeader className="flex flex-row items-center gap-2">
          <DialogTitle className="!m-0">
            Invite Members to the workspace
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleInvite)}>
          <div className="w-full">
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
          </div>
          <div className="flex justify-between">
            <Button
              size="sm"
              className="flex  gap-2 items-center"
              variant="ghost"
              disabled={isPending}
              type="button"
              onClick={appendField}
            >
              Add More <PlusIcon size={16} />
            </Button>

            <div className="flex gap-2 ">
              <Button
                type="button"
                disabled={isPending || !isValid}
                size={"sm"}
                onClick={onClose}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                disabled={isPending || !isValid}
                type="submit"
                size={"sm"}
              >
                {isPending ? "Adding" : "Add"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberModal;
