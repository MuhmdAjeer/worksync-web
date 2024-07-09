import ProjectHeader from "@/components/headers/ProjectHeader";
import CreateIssueModal from "@/components/issues/create-issue-modal";
import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectModal from "@/components/projects/create-project-modal";

import { Button } from "@/components/ui/button";

import { useProjects } from "@/hooks/projects";
import { useAppRouter } from "@/hooks/router";
import { useWorkspace } from "@/hooks/workspaces";
import { AppLayout } from "@/components/layouts/app/AppLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner/Spinner";
import { useProjectStore } from "@/hooks/store/project";
import { useRouter } from "next/router";

const ProjectsPage: NextPageWithLayout = observer(() => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { workspaceSlug } = useAppRouter();
  const { data: workspaceProjects, isLoading } = useProjects(workspaceSlug!);

  if (!workspaceProjects?.length) {
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
  }

  return (
    <div className="grid grid-cols-3 m-4 gap-4">
      {workspaceProjects.map((project) => (
        <ProjectCard project={project} key={project.id} />
      ))}
    </div>
  );
});

ProjectsPage.getLayout = function getLayout(children: ReactElement) {
  return <AppLayout header={<ProjectHeader />}>{children}</AppLayout>;
};

export default ProjectsPage;
