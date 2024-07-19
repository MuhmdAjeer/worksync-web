import React, { FC, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ProjectsComboBox from "../projects/ProjectsComboBox";
import { useCurrentProject } from "@/hooks/projects";
import { observer } from "mobx-react";
import { useForm } from "react-hook-form";
import { CreateIssueDto } from "@/generated/dto/create-issue-dto";
import { useCreateIssue } from "@/hooks/issue";
import { toast } from "sonner";
import IssueForm from "./IssueForm";
import { IssueDto } from "@/generated/dto/issue-dto";
interface IProps {
  open: boolean;
  onClose: () => void;
  issue: IssueDto;
}

const UpdateIssueModal: FC<IProps> = observer(({ onClose, open, issue }) => {
  const [openProjectsComboBox, setProjectsComboBox] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const { data: currentProject } = useCurrentProject();
  const { mutate: createIssue, isPending } = useCreateIssue();
  const form = useForm<CreateIssueDto>({
    defaultValues: {
      ...issue,
      assignees_id: issue.assignees?.map((x) => x.id),
      state: issue.state?.id,
    },
  });

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
    // @ts-nocheck
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
        <IssueForm
          activeProjectId={activeProjectId}
          form={form}
          handleFormSubmit={handleAddIssue}
          isPending={isPending}
          issue={issue}
          key={activeProjectId}
        />
      </DialogContent>
    </Dialog>
  );
});

export default UpdateIssueModal;
