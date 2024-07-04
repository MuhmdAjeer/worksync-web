import React from "react";
import Typography from "../ui/Typography";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CreateWorkspaceDto } from "@/generated/dto/create-workspace-dto";
import { WorkspaceService } from "@/services/workspace.service";
import { useUpdateUser } from "@/hooks/user";
import { useCreateWorkspace } from "@/hooks/workspaces";
import { Spinner } from "../Spinner/Spinner";
import { OnboardMeta } from "@/generated/dto/onboard-meta";

interface IProps {
  toggleView: () => void;
  totalInvitations: number;
  changeStep: (data: OnboardMeta) => void;
}

const CreateWorkspace: React.FC<IProps> = ({
  toggleView,
  totalInvitations,
  changeStep,
}) => {
  const form = useForm<CreateWorkspaceDto>({
    defaultValues: {
      name: "",
      slug: "",
      use: "_FIX_HERE",
      members: [],
    },
    mode: "onChange",
  });

  const { mutate: updateProfile } = useUpdateUser();
  const { mutateAsync: createWorkspace, isPending } = useCreateWorkspace();

  const handleCreateWorkspace = async (data: CreateWorkspaceDto) => {
    createWorkspace(data).then((res) => {
      changeStep({ workspace_create: true });
    });
  };
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button
          disabled={totalInvitations === 0}
          onClick={toggleView}
          className="w-full"
          variant="secondary"
        >
          I want to join invited workspaces
        </Button>
      </div>
      <div className="mx-auto flex items-center w-full">
        <hr className="w-full border-secondary" />
        <p className="mx-3 text-primary/50">or</p>
        <hr className="w-full border-secondary" />
      </div>
      <div>
        <Typography className="mb-4" variant="h3">
          What will your workspace be?
        </Typography>
        <form
          className="flex gap-2 flex-col"
          onSubmit={form.handleSubmit(handleCreateWorkspace)}
        >
          <div>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Name"
                  message={fieldState.error?.message}
                  placeholder="Enter your workspace name"
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={form.control}
              name="slug"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Slug"
                  message={fieldState.error?.message}
                  placeholder={`app.worksync.com/your_slug_here`}
                />
              )}
            />
          </div>
          <div className="mt-4">
            <Button
              disabled={
                isPending ||
                !form.formState.isValid ||
                form.formState.isSubmitting
              }
              type="submit"
            >
              {form.formState.isSubmitting ? <Spinner /> : "Go Live"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspace;
