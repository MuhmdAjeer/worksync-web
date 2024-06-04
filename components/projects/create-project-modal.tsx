/* eslint-disable @next/next/no-img-element */
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
import { X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import EmojiPicker from "emoji-picker-react";
import ImagePickerPopover from "./ImagePickerPopover";
import ProjectLogo from "./ProjectLogo";
import { convertHexEmojiToDecimal, getRandomEmoji } from "@/lib/utils";
import Image from "next/image";

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

export const PROJECT_UNSPLASH_COVERS = [
  "https://images.unsplash.com/photo-1531045535792-b515d59c3d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1693027407934-e3aa8a54c7ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1464925257126-6450e871c667?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1606768666853-403c90a981ad?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1643330683233-ff2ac89b002c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1475738972911-5b44ce984c42?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1673393058808-50e9baaf4d2c?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1696643830146-44a8755f1905?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1693868769698-6c7440636a09?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1691230995681-480d86cbc135?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
  "https://images.unsplash.com/photo-1675351066828-6fc770b90dd2?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=870&q=80",
];

const CreateProjectModal = observer((props: TProps) => {
  const { open, onClose } = props;
  const session = useSession();
  const { currentWorkspace } = useWorkspace();
  const { createProject } = useProject();
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
  watch("logo");
  const submit: SubmitHandler<CreateProjectDto> = async (data) => {
    try {
      await createProject(data);
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
              <button
                data-posthog="PROJECT_MODAL_CLOSE"
                type="button"
                onClick={onClose}
                tabIndex={8}
              >
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
                      <span className="grid h-11 w-11 place-items-center rounded-md bg-slate-300">
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
