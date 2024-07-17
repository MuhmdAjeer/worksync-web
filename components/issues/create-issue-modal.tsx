import React, { FC, use, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import ProjectsComboBox from "../projects/ProjectsComboBox";
import { useCurrentProject } from "@/hooks/projects";
import { observer } from "mobx-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import IssueStatesDropdown from "./IssueStateDropdown";
import IssuePriorityDropdown from "./IssuePriorityDropdown";
import ProjectMembersDropdown from "../Multiselect/ProjectMembers";
import { Controller, useForm } from "react-hook-form";
import { CreateIssueDto } from "@/generated/dto/create-issue-dto";
import DatePicker from "../ui/datePicker";
import { Button } from "../ui/button";
import { useCreateIssue } from "@/hooks/issue";
import { toast } from "sonner";
import Tiptap from "../Editor";
interface IProps {
  open: boolean;
  onClose: () => void;
}

const CreateIssueModal: FC<IProps> = observer(({ onClose, open }) => {
  const [openProjectsComboBox, setProjectsComboBox] = useState(false);
  const [stateDropdown, setStateDropdown] = useState(false);
  const [priorityDropdown, setPriorityDropdown] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const { data: currentProject } = useCurrentProject();
  const { mutate: createIssue, isPending } = useCreateIssue();
  const {
    handleSubmit,
    formState: { isSubmitting },
    ...form
  } = useForm<CreateIssueDto>({
    defaultValues: {
      assignees_id: [],
      title: "",
    },
  });
  const minDate = form.watch("start_date");
  const maxDate = form.watch("end_date");

  const handleAddIssue = (data: CreateIssueDto) => {
    if (!activeProjectId) return;
    createIssue(
      { ...data, projectId: activeProjectId },
      {
        onSuccess: () => {
          toast.success("Issue added successfully!");
        },
      }
    );
  };

  useEffect(() => {
    if (currentProject) {
      setActiveProjectId(currentProject.id);
    }
  }, [currentProject]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  if (!activeProjectId) {
    return null;
  }

  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[40%]">
        <DialogHeader className="flex flex-row items-center gap-2">
          <ProjectsComboBox
            open={openProjectsComboBox}
            onOpenChange={(value) => {
              setProjectsComboBox(value);
            }}
            value={activeProjectId ?? undefined}
            onChange={(value) => setActiveProjectId(value)}
          />
          <DialogTitle className="!m-0">Create Issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleAddIssue)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Controller
                control={form.control}
                name="title"
                rules={{
                  required: "Title is required",
                  maxLength: {
                    value: 120,
                    message: "Title is too long",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    name="Title"
                    placeholder="Title"
                    message={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="description"
                render={({ field }) => <Tiptap onChange={field.onChange} />}
              />
            </div>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex gap-2 items-center">
                <Controller
                  control={form.control}
                  name="state"
                  render={({ field: { onChange, value } }) => (
                    <IssueStatesDropdown
                      projectId={activeProjectId}
                      open={stateDropdown}
                      onOpenChange={(v) => setStateDropdown(v)}
                      onChange={(value) => {
                        onChange(value.name);
                      }}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="priority"
                  render={({ field: { onChange, value } }) => (
                    <IssuePriorityDropdown
                      open={priorityDropdown}
                      onOpenChange={(v) => setPriorityDropdown(v)}
                      onChange={(value) => {
                        onChange(value.name);
                      }}
                    />
                  )}
                />
                <Controller
                  name="assignees_id"
                  control={form.control}
                  render={({ field: { value, onChange } }) => (
                    <ProjectMembersDropdown
                      projectId={activeProjectId}
                      value={value ?? []}
                      label="Assignees"
                      onChange={onChange}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="start_date"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      label="Start Date"
                      value={value}
                      onChange={onChange}
                      maxDate={maxDate}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="end_date"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      label="End Date"
                      value={value}
                      minDate={minDate}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
              <Button
                disabled={isPending || isSubmitting}
                type="submit"
                size="sm"
              >
                {isPending || isSubmitting ? "Adding..." : "Add Issue"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default CreateIssueModal;
