import React, { ReactElement, useState } from "react";
import SettingsHeader from "@/components/headers/SettingsHeader";
import { ProjectSettings } from "@/components/layouts/app/ProjectSettings";
import { Button } from "@/components/ui/button";
import {
  useAddLabel,
  useDeleteLabel,
  useLabels,
  useUpdateLabel,
} from "@/hooks/projects";
import { useRouter } from "next/router";
import { PencilIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AddLabelDto } from "@/generated/dto/add-label-dto";
import { toast } from "sonner";
import { TwitterPicker } from "react-color";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { IssueLabel } from "@/generated/dto/issue-label";
import { confirmAlert } from "@/components/modal/confirm-alert";

const COLOR_LIST = [
  "#ff7f50",
  "#87cefa",
  "#da70d6",
  "#32cd32",
  "#6495ed",
  "#ff69b4",
  "#ba55d3",
  "#cd5c5c",
  "#ffa500",
  "#40e0d0",
];

const Labels = () => {
  const { projectId } = useRouter().query;
  const { data: issueLabels } = useLabels(projectId?.toString()!);
  const [editingLabel, setEditingLabel] = useState<IssueLabel | null>(null);
  const [addLabelView, setAddLabelView] = useState(false);

  const { control, handleSubmit, reset } = useForm<AddLabelDto>({
    defaultValues: { color: "#FCB900" },
  });

  const { mutate: addLabel } = useAddLabel();
  const { mutate: deleteLabel } = useDeleteLabel();
  const { mutate: updateLabel } = useUpdateLabel();

  const handleAddLabel: SubmitHandler<AddLabelDto> = async (data) => {
    if (!projectId) return;
    addLabel(
      { id: projectId?.toString(), body: data },
      {
        onSuccess: () => {
          setAddLabelView(false);
          reset();
          toast.success("Label Added Successfully");
        },
      },
    );
  };

  const handleLabelUpdate = () => {
    if (!editingLabel || !projectId) return;
    setEditingLabel(null);
    updateLabel(
      {
        labelId: editingLabel.id,
        projectId: projectId?.toString(),
        body: editingLabel,
      },
      {
        onSuccess: () => toast.success("Updated Label Successfully"),
      },
    );
  };
  if (!issueLabels) return null;
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1>Labels</h1>
        <Button onClick={() => setAddLabelView(true)} size={"xs"}>
          Add Label
        </Button>
      </div>
      <div className="my-6">
        {addLabelView && (
          <form onSubmit={handleSubmit(handleAddLabel)}>
            <div className="border w-full my-2 rounded-md px-4 py-2 flex justify-between gap-4 items-center">
              <div className="flex gap-2 items-center">
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <Popover modal>
                      <PopoverTrigger className="relative" asChild>
                        <div
                          style={{ backgroundColor: field.value }}
                          className=" rounded-full h-6 w-6 cursor-pointer"
                        ></div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-none absolute left-0">
                        <TwitterPicker
                          colors={COLOR_LIST}
                          color={field.value}
                          onChange={(value: any) => field.onChange(value.hex)}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Label Name"
                      className="w-auto focus-visible:ring-0"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  size="xs"
                  variant={"outline"}
                  type="button"
                  onClick={() => setAddLabelView(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="xs">
                  Add
                </Button>
              </div>
            </div>
          </form>
        )}
        {issueLabels.map((label) => (
          <div
            key={label.id}
            className="border group w-full shadow-sm rounded-md px-4 py-2 my-2 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              {editingLabel?.id !== label.id ? (
                <div
                  style={{
                    backgroundColor: label.color,
                  }}
                  className="rounded-full h-6 w-6"
                ></div>
              ) : (
                <Popover modal>
                  <PopoverTrigger className="relative" asChild>
                    <div
                      style={{
                        backgroundColor: editingLabel.color,
                      }}
                      className="rounded-full h-6 w-6"
                    ></div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none absolute left-0">
                    <TwitterPicker
                      colors={COLOR_LIST}
                      color={editingLabel?.color}
                      onChange={(value: any) => {
                        setEditingLabel((v) =>
                          v ? { ...v, color: value.hex } : null,
                        );
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}

              {editingLabel?.id === label.id ? (
                <Input
                  className="w-auto focus-visible:ring-0 h-auto"
                  value={editingLabel.name}
                  onChange={(e) => {
                    setEditingLabel((v) =>
                      v ? { ...v, name: e.target.value } : null,
                    );
                  }}
                />
              ) : (
                <h1 className="text-sm ">{label.name}</h1>
              )}
            </div>
            {editingLabel && editingLabel.id === label.id ? (
              <div
                className={cn(
                  "items-center gap-1 invisible flex ",
                  editingLabel?.id === label.id
                    ? "visible"
                    : "group-hover:visible",
                )}
              >
                <Button
                  onClick={() => {
                    setEditingLabel(null);
                  }}
                  size={"xs"}
                  variant={"outline"}
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => {
                    handleLabelUpdate();
                  }}
                  size={"xs"}
                  // variant={""}
                >
                  Update
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  "items-center gap-1 invisible flex ",
                  editingLabel?.id === label.id
                    ? "visible"
                    : "group-hover:visible",
                )}
              >
                <Button
                  onClick={() => {
                    setEditingLabel(label);
                  }}
                  size={"xs"}
                  variant={"outline"}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>

                <Button
                  onClick={() => {
                    if (!projectId) return;
                    confirmAlert({
                      title: "Delete Label",
                      message: `You are about to permanently delete the label ${label.name} from this project. This action cannot be undone, and any tasks or issues currently associated with this label will no longer have it assigned`,
                    }).then(() => {
                      deleteLabel({
                        labelId: label.id,
                        projectId: projectId?.toString(),
                      });
                    });
                  }}
                  size={"xs"}
                  variant={"ghost"}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

Labels.getLayout = function getLayout(children: ReactElement) {
  return (
    <ProjectSettings header={<SettingsHeader />}>{children} </ProjectSettings>
  );
};
export default Labels;
