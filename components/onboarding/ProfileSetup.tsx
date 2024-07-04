import React, { useState } from "react";
import Typography from "../ui/Typography";
import FileInput from "../ui/FileInput";
import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { useUpdateUser, useUser } from "@/hooks/user";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { OnboardMeta } from "@/generated/dto/onboard-meta";
import { Spinner } from "../Spinner/Spinner";
import { useUpload } from "@/hooks/upload";
import { TypeEnum } from "@/generated/dto/file-upload-request-dto";

const WORKSYNC_USE_OPTIONS = [
  "Project Managing",
  "Bug Tracking",
  "Test Feedback",
  "Task Scheduling",
  "Time Tracking",
  "Team Collaboration",
  "Document Sharing",
    "Code Review",
    "Feature Requests",
    "Customer Support",
    "Meeting Coordination",
    "Resource Allocation",
    "Performance Evaluation",
    "Workflow Automation",
    "Data Analysis",
    "Quality Assurance",
    "Progress Monitoring",
    "Training and Onboarding",
    "Product Development",
];

interface IProfileSetupFormValues {
  user_name: string;
  use: string;
  profile_picture?: string;
}

interface IProps {
  changeStep: (data: OnboardMeta) => void;
}

const ProfileSetup: React.FC<IProps> = ({ changeStep }) => {
  const { data: user } = useUser();
  const { mutateAsync: updateUser, isPending } = useUpdateUser();
  const { mutateAsync: uploadFile } = useUpload();
  const [avatar, setAvatar] = useState<globalThis.File>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const form = useForm<IProfileSetupFormValues>({
    defaultValues: {
      user_name: user?.username,
      profile_picture: user?.profile_picture,
    },
    mode: "onChange",
  });

  const handleUpdateProfile = async (data: IProfileSetupFormValues) => {
    if (avatar) {
      const url = await uploadFile({
        file: avatar,
        fileDetails: {
          file_name: avatar?.name,
          mimeType: avatar?.type,
          type: TypeEnum.UserImage,
        },
      });
      data.profile_picture = url;
    }
    updateUser(data).then((res) => {
      changeStep({ profile_complete: true });
    });
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(handleUpdateProfile)}
    >
      <div className="flex flex-col gap-6">
        <Typography variant="h3">What should we call you?</Typography>
        <div className="flex flex-row gap-4 items-center   ">
          <FileInput
            file={avatar}
            setFile={setAvatar}
            placeHolder="Profile Image"
          />
          <div>
            <Controller
              control={form.control}
              name="user_name"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  message={fieldState.error?.message}
                  placeholder="Enter your full name"
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Typography variant="h3">How will you use Worksync+ ?</Typography>
        <div className="flex gap-4 w-full flex-wrap">
          {WORKSYNC_USE_OPTIONS.map((opt) => (
            <>
              <div
                onClick={() => {
                  setSelectedOption(opt);
                }}
                className="relative"
              >
                <div
                  className={cn(
                    "border border-primary/10 rounded-lg w-max p-2 hover:bg-primary/20 hover:text-primary-950 cursor-pointer",
                    selectedOption == opt && "border-primary"
                  )}
                >
                  <Typography variant="h4" affects="small">
                    {opt}
                  </Typography>
                </div>
              </div>
            </>
          ))}
        </div>
        <div className="flex gap-2">
          <Button disabled={isPending || !form.formState.isValid}>
            {form.formState.isSubmitting ? <Spinner /> : "Continue"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfileSetup;
