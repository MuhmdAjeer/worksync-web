import { BriefcaseIcon } from "lucide-react";
import React, { useState } from "react";
import Typography from "../ui/Typography";
import { Button } from "../ui/button";
import CreateProjectModal from "../projects/create-project-modal";

const ProjectHeader = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <div className="h-14 p-4 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <BriefcaseIcon className="text-slate-500 h-5 w-5" />
          <Typography variant="h6" className="text-slate-800">
            Projects
          </Typography>
        </div>
        <div>
          <Button
            onClick={() => {
              setOpenModal(true);
            }}
            size="sm"
          >
            Create Project
          </Button>
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
