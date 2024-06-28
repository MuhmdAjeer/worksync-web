import { BriefcaseIcon } from "lucide-react";
import React, { useState } from "react";
import Typography from "../ui/Typography";
import { Button } from "../ui/button";
import CreateProjectModal from "../projects/create-project-modal";
import { ThemeModelToggle } from "../common/ThemeModeToggle";

const ProjectHeader = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <div className="h-14 p-4 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <BriefcaseIcon className="h-5 w-5" />
          <Typography variant="h6">Projects</Typography>
        </div>
        <div className="flex items-center gap-4" >
          <Button
            onClick={() => {
              setOpenModal(true);
            }}
            size="sm"
          >
            Create Project
          </Button>
          <ThemeModelToggle />
        </div>
      </div>
      <CreateProjectModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </>
  );
};

export default ProjectHeader;
