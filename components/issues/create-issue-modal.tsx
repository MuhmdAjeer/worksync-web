import React, { FC, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ProjectsComboBox from "../projects/ProjectsComboBox";
import { useCurrentProject } from "@/hooks/projects";
import { observer } from "mobx-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import IssueStatesDropdown from "./IssueStateDropdown";
import IssuePriorityDropdown from "./IssuePriorityDropdown";
import MemberDropdown from "../MemberDropdown";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const CreateIssueModal: FC<IProps> = observer(({ onClose, open }) => {
  const [openProjectsComboBox, setProjectsComboBox] = useState(false);

  const { data: currentProject } = useCurrentProject();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (currentProject) {
      setActiveProjectId(currentProject.id);
    }
  }, [currentProject]);

  const [stateDropdown, setStateDropdown] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
        <div className="flex flex-col gap-2">
          <Input name="Title" placeholder="Title" />
          <Textarea rows={10} name="Description" placeholder="Description" />
        </div>
        <div className="flex gap-2">
          {/* <IssueStatesDropdown
          // open={stateDropdown}
          // onOpenChange={(v) => setStateDropdown(v)}
          /> */}
          <IssuePriorityDropdown
            open={stateDropdown}
            onOpenChange={(v) => setStateDropdown(v)}
          />
          {/* <MemberDropdown label="Assignees" /> */}
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default CreateIssueModal;
