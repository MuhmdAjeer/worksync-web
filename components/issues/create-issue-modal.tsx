import React, { FC, useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { CreateIssueDto } from "@/generated/dto/create-issue-dto";
import { useCreateIssue } from "@/hooks/issue";
import { toast } from "sonner";
import IssueForm from "./IssueForm";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
interface IProps {
  open: boolean;
  onClose: () => void;
}

const CreateIssueModal: FC<IProps> = observer(({ onClose, open }) => {
  const [openProjectsComboBox, setProjectsComboBox] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const { data: currentProject } = useCurrentProject();
  const { mutate: createIssue, isPending } = useCreateIssue();
  const form = useForm<CreateIssueDto>({
    defaultValues: {
      assignees_id: [],
      label_ids: [],
      title: "",
    },
  });

  console.log(form.watch("label_ids"));

  const handleAddIssue = (data: CreateIssueDto) => {
    if (!activeProjectId) return;
    createIssue(
      { ...data, projectId: activeProjectId },
      {
        onSuccess: () => {
          onClose();
          toast.success("Issue added successfully!");
        },
      },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!activeProjectId) {
    return null;
  }

  return (
    <Dialog modal open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[40%] flex ">
        <form
          className="gap-4 flex flex-col w-full"
          onSubmit={form.handleSubmit(handleAddIssue)}
        >
          <DialogHeader className="flex flex-row items-center gap-2 w-auto">
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
            key={activeProjectId}
          />

          <Separator />
          <DialogFooter>
            <Button type="button" onClick={onClose} variant="outline" size="sm">
              Cancel
            </Button>

            <Button type="submit" size="sm">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default CreateIssueModal;
