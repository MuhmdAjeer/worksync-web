import CreateProjectModal from "@/components/projects/create-project-modal";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/layouts/app/AppLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";

const ProjectsPage: NextPageWithLayout = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);

  return (
    <div className="space-y-7 md:p-7 p-3 bg-custom-background-90 h-full w-full flex flex-col overflow-y-auto">
      <div className="text-center items-center h-full">
        <Button onClick={() => setOpenCreateModal(true)}>
          Create your first project
        </Button>
        <CreateProjectModal
          open={openCreateModal}
          onClose={() => {
            setOpenCreateModal(false);
          }}
        />
      </div>
    </div>
  );
};
ProjectsPage.getLayout = function getLayout(children: ReactElement) {
  return <AppLayout>{children}</AppLayout>;
};
export default ProjectsPage;
