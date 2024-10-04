import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import InviteMemberInput from "../InviteMemberInput";
import { useFieldArray, useForm } from "react-hook-form";
// import { FormValues } from "../onboarding/InviteMembers";
import { useInviteMembers } from "@/hooks/workspaces";
import { RoleEnum } from "@/generated/dto/invitation-dto";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import AddMemberInput from "./AddMemberInput";
import { useAddProjectMembers } from "@/hooks/projects";
import { FormValues } from "../onboarding/InviteMembers";

interface IProps {
	open: boolean;
	onClose: () => void;
	projectId?: string;
}

const AddMemberModal: React.FC<IProps> = ({ onClose, open, projectId }) => {
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
	console.log({ errors });
	const { mutate: addMember, isPending } = useAddProjectMembers();

	const appendField = () => {
		if (fields.length === 8) {
			toast.warning("Maximum number of field limit reached!");
			return;
		}

		append({ email: "", role: RoleEnum.Admin });
	};

	const handleInvite = async (data: FormValues) => {
		if (!projectId) return;
		addMember(
			{
				data: {
					members: data.emails.map((x) => ({ userId: x.email, role: x.role })),
				},
				id: projectId,
			},
			{
				onSuccess: () => {
					onClose();
					toast.success("Added Member successfully! ");
				},
			},
		);
		// inviteMembers(
		//   { slug: workspace, data },
		// );
		// // .catch((err) => console.log(err));
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
					<DialogTitle className="!m-0">Add Members to the Project</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(handleInvite)}>
					<div className="w-full">
						{fields.map((field, index) => (
							<AddMemberInput
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

export default AddMemberModal;
