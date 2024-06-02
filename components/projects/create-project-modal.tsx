import React, { useEffect } from "react";

import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CreateProjectDto } from "@/generated/dto/create-project-dto";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWorkspace } from "@/hooks/workspace";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import MemberDropdown from "../MemberDropdown";
import { ProjectService } from "@/services/project.service";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { ErrorMessage } from "@hookform/error-message";
import { observer } from "mobx-react";
import { useProject } from "@/hooks/project";

type TProps = {
  open?: boolean;
  onClose: () => void;
};
const createProjectSchema: ZodType<CreateProjectDto> = z.object({
  name: z.string(),
  description: z.string(),
  custom_id: z.string(),
  workspace_id: z.string(),
  lead_id: z.string(),
});

const CreateProjectModal = observer((props: TProps) => {
  const { open, onClose } = props;
  const session = useSession();
  const { currentWorkspace } = useWorkspace();
  const { createProject } = useProject();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      workspace_id: currentWorkspace?.id,
      lead_id: session.data?.user.id,
    },
  });
  const submit: SubmitHandler<CreateProjectDto> = async (data) => {
    try {
      const response = await createProject(data);
      toast.success("Project created successfully");
    } catch (error) {
      toast.error("Failed to create project!");
    }
  };

  useEffect(() => {
    reset();
  }, [reset, open]);
  return (
    <Dialog onOpenChange={() => onClose()} modal={true} open={open}>
      <DialogContent className="w-full">
        <form className="flex gap-4 flex-col">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input {...field} label="Name" placeholder="name" />
              )}
            />
            <Controller
              control={control}
              name="custom_id"
              render={({ field }) => (
                <Input {...field} label="Project ID" placeholder="WRS" />
              )}
            />
          </div>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                {...field}
                className=""
                label="Description"
                placeholder="Add your project description"
              />
            )}
          />
        </form>
        <h2>{errors.lead_id?.message}</h2>
        <DialogFooter>
          <MemberDropdown />
          <Button
            onClick={() => {
              void handleSubmit(submit)();
            }}
          >
            Create project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default CreateProjectModal;
