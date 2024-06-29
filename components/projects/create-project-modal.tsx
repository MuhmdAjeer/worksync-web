/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";

import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CreateProjectDto } from "@/generated/dto/create-project-dto";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import MemberDropdown from "../MemberDropdown";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { observer } from "mobx-react";
import { X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import EmojiPicker from "emoji-picker-react";
import ImagePickerPopover from "./ImagePickerPopover";
import ProjectLogo from "./ProjectLogo";
import { convertHexEmojiToDecimal, getRandomEmoji } from "@/lib/utils";
import Image from "next/image";
import { PROJECT_UNSPLASH_COVERS } from "@/lib/constants";
import { useCreateProject } from "@/hooks/projects";
// import { useWorkspace } from "@/hooks/workspaces";
import { useAppRouter } from "@/hooks/router";
import { useWorkspaceStore } from "@/hooks/store/workspace";

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
  cover_image: z.string().optional(),
  logo: z.string().optional(),
});

const CreateProjectModal = observer((props: TProps) => {
  const { open, onClose } = props;
  const { currentWorkspace } = useWorkspaceStore();
  const session = useSession();
  const { mutate: createProject } = useCreateProject();

  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      workspace_id: currentWorkspace?.id,
      lead_id: session.data?.user.id,
      cover_image:
        PROJECT_UNSPLASH_COVERS[
          Math.floor(Math.random() * PROJECT_UNSPLASH_COVERS.length)
        ],
      logo: getRandomEmoji(),
    },
  });

  const submit: SubmitHandler<CreateProjectDto> = async (data) => {
    try {
      createProject(data);
      onClose();
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
      <DialogContent className="min-w-[40%]">
        <form className="flex gap-4 flex-col">
          <div className="group relative h-44 w-full rounded-lg">
            {watch("cover_image") && (
              <Image
                src={watch("cover_image")!}
                className="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
                width={0}
                height={0}
                sizes="100vw"
                alt="cover image"
              />
            )}
            <div className="absolute right-2 top-2 p-2">
              <button type="button" onClick={onClose} tabIndex={8}>
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="absolute bottom-[-22px] left-3">
              <Controller
                control={control}
                name="logo"
                render={({ field, fieldState }) => (
                  <Popover>
                    <PopoverTrigger>
                      <span className="grid h-11 w-11 place-items-center rounded-md bg-secondary">
                        <ProjectLogo value={field.value} className="text-xl" />
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-full">
                      <EmojiPicker
                        onEmojiClick={(emoji) => {
                          field.onChange(
                            convertHexEmojiToDecimal(emoji.unified)
                          );
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div className="absolute bottom-2 right-2">
              <Controller
                control={control}
                name="cover_image"
                render={({ field }) => (
                  <ImagePickerPopover
                    {...field}
                    selectedImage={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 my-2">
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
        <DialogFooter>
          <MemberDropdown />
          <Button
            onClick={() => {
              void handleSubmit(submit)();
            }}
            size="sm"
          >
            Create project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default CreateProjectModal;
