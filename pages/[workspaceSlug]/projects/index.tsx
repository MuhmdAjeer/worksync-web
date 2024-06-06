/* eslint-disable jsx-a11y/alt-text */
import Tooltip from "@/components/common/Tooltip";
import ProjectLogo from "@/components/projects/ProjectLogo";
import CreateProjectModal, {
  PROJECT_UNSPLASH_COVERS,
} from "@/components/projects/create-project-modal";
import Typography from "@/components/ui/Typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import UserAvatar from "@/components/user/Avatar";
// import Avatar from "@/components/user/Avatar";
import { useProject } from "@/hooks/project";
import { AppLayout } from "@/layouts/app/AppLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { observer } from "mobx-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";

const ProjectsPage: NextPageWithLayout = observer(() => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { workspaceProjects } = useProject();
  if (!workspaceProjects.length) {
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
        <Card className="rounded" key={project.id}>
          <div className="relative rounded-xl h-[120px]">
            <Image
              src={project.cover_image ?? PROJECT_UNSPLASH_COVERS[0]}
              sizes="100vw"
              height={0}
              width={0}
              alt="cover image"
              className="w-full h-full top-0 rounded-t left-0 object-cover"
            />
            <div className="absolute flex flex-row items-center gap-2  p-2 bottom-0">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-slate-300">
                <ProjectLogo value={project.logo} className="text-xl" />
              </span>
              <div className="flex text-white flex-col">
                <Typography variant="h4">{project.name}</Typography>
                <Typography affects="small" className="p-0 !m-0" variant="p">
                  {project.custom_id}
                </Typography>
              </div>
            </div>
          </div>
          <div className="h-[100px] p-4 grid gap-2">
            <Typography variant="p" affects="muted">
              {project.description}
            </Typography>
            <Tooltip
              title={
                <div className="flex flex-col items-center gap-1">
                  <h1>Members</h1>
                  <p>{`${project.members.length} members`}</p>
                </div>
              }
            >
              <div>
                {project.members.map((user) => (
                  <UserAvatar user={user} key={user.id} />
                ))}
              </div>
            </Tooltip>
          </div>
        </Card>
      ))}
    </div>
  );
});
ProjectsPage.getLayout = function getLayout(children: ReactElement) {
  return <AppLayout>{children}</AppLayout>;
};
export default ProjectsPage;
