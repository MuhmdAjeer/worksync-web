"use client";
import { onboardingSchema } from "@/lib/schema/Workspace";
import { OnboardingWorkspace } from "@/lib/types/Workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Typography from "../ui/Typography";
import FileInput from "../ui/FileInput";
import { cn } from "@/lib/utils";
import InviteMemberInput, { Field } from "../InviteMemberInput";
import { OnboardDto } from "@/generated/dto/onboard-dto";
import { UseOnboardUser } from "@/hooks/Onboard";
import ApiClient from "@/lib/apiClient";
import { TypeEnum } from "@/generated/dto/file-upload-request-dto";
import { useWorkspace } from "@/hooks/store/workspace";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";

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

const OnboardingForm = observer(() => {
  const form = useForm<OnboardDto>({
    resolver: zodResolver(onboardingSchema),
  });
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const router = useRouter();
  const [avatar, setAvatar] = useState<globalThis.File>();
  const { onboardUser } = useWorkspace();
  const [fields, setFields] = useState([
    { email: "", role: "" },
    { email: "", role: "" },
    { email: "", role: "" },
  ]);
  const removeField = (index: number) => {
    setFields((prev) => prev.filter((x, i) => i !== index));
  };
  const handleInviteFormChange = (index: number, field: Field) => {
    console.log(field);
    const x = [...fields];
    x[index] = field;
    setFields(x);
  };

  const handleOnboarding = async () => {
    if (!selectedOption) return;
    let profile_picture_url = "NO IMAGE";
    if (avatar) {
      profile_picture_url = await ApiClient.uploadFile(
        {
          file_name: avatar?.name,
          mimeType: avatar?.type,
          type: TypeEnum.UserImage,
        },
        avatar
      );
    }
    const data: OnboardDto = {
      ...form.getValues(),
      name: form.getValues("name").trim(),
      members: fields,
      use: selectedOption,
      profile_picture: profile_picture_url,
    };
    await onboardUser(data)
      .then((res) => {
        toast.success("Onboarding success!");
        router.push(`/${res.name}`);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Onboarding Failed! try again");
      });
  };

  return (
    <div className="flex gap-4 flex-col">
      {step === 1 && (
        <>
          <Typography className="mb-4" variant="h3">
            What will your workspace be?
          </Typography>
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
          <div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              // disabled={!values.name || !values.slug}
            >
              Go Live
            </Button>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <Typography className="mb-4" variant="h3">
            What should we call you?
          </Typography>
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

          <Typography variant="h3" className="mb-4">
            How will you use Worksync+ ?
          </Typography>
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
                  {/* {selectedOption === opt && (
                    <div className="absolute bg-slate-50 border rounded-full top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )} */}
                </div>
              </>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setStep((prev) => prev - 1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Continue</Button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          {fields.map((field, index) => (
            <InviteMemberInput
              field={field}
              index={index}
              onChange={handleInviteFormChange}
              key={index}
              remove={removeField}
            />
          ))}
          <Button
            onClick={(e) => {
              e.preventDefault();
              setFields((prev) => [...prev, { email: "", role: "" }]);
            }}
            variant="link"
          >
            + Add another
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => setStep((prev) => prev - 1)}>Back</Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleOnboarding();
              }}
              disabled={fields.some((x) => !x.email || !x.role)}
            >
              Invite Members
            </Button>
          </div>
        </>
      )}
    </div>
  );
});

export default OnboardingForm;
