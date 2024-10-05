import { NextPageWithLayout } from "@/pages/_app";
import { observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import SettingsHeader from "@/components/headers/SettingsHeader";
import { ProjectSettings as Layout } from "@/components/layouts/app/ProjectSettings";
import Image from "next/image";
import { useProject, useUpdateProject } from "@/hooks/projects";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Popover } from "@headlessui/react";
import ProjectLogoPicker from "@/components/projects/ProjectLogoPicker";
import { ZodType, z } from "zod";
import { UpdateProjectDto } from "@/generated/dto/update-project-dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { PROJECT_UNSPLASH_COVERS } from "@/lib/constants";
import ImagePickerPopover from "@/components/projects/ImagePickerPopover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DeleteProject from "@/components/projects/DeleteProjectAccordion";

const ProjectSettings: NextPageWithLayout = observer(() => {
  const { projectId } = useRouter().query;
  const { data: project } = useProject(projectId?.toString());
  const { mutate: updateProject } = useUpdateProject();

  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProjectDto>();

  useEffect(() => {
    if (project) {
      reset({
        cover_image: project.cover_image,
        name: project.name,
        lead_id: project.lead?.id, // Added optional chaining
        custom_id: project.custom_id,
        description: project.description,
        logo: project.logo,
      });
    }
  }, [project, reset]);

  const handleUpdate: SubmitHandler<UpdateProjectDto> = async ({
    lead_id,
    ...body
  }) => {
    if (!project?.id) return;
    updateProject(
      { id: project.id, body },
      {
        onSuccess: () => {
          toast.success("Project updated successfully");
        },
      },
    );

    // .then((res) => {
    //  });
  };

  if (!project) return null;
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="h-44 w-full relative rounded-md">
          <div className="absolute rounded-md inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <Image
            alt="project cover"
            className="h-44 object-cover w-full rounded-md"
            src={watch("cover_image")!}
            height={0}
            width={0}
            sizes="100vw"
          />
          <div className="absolute bottom-3 px-4 flex w-full justify-between items-center">
            <div className="">
              <Controller
                control={control}
                name="logo"
                render={({ field, fieldState }) => (
                  <ProjectLogoPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className="">
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
        </div>
        <div className="grid my-4 grid-cols-2 gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <div>
                <Label htmlFor="name">{"Project Name"}</Label>
                <Input
                  label="Name"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="custom_id"
            render={({ field }) => (
              <div>
                <Label htmlFor="custom_id">Custom Id</Label>
                <Input
                  label="Custom Id"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </div>
            )}
          />
        </div>
        <Button type="submit">Update</Button>
      </form>
      <div className="my-4 w-full">
        <DeleteProject projectId={project.id} />
      </div>
    </div>
  );
});

ProjectSettings.getLayout = function getLayout(children: ReactElement) {
  return <Layout header={<SettingsHeader />}>{children} </Layout>;
};

export default ProjectSettings;
