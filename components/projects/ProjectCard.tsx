import React, { FC } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import ProjectLogo from "./ProjectLogo";
import Typography from "../ui/Typography";
import Tooltip from "../common/Tooltip";
import UserAvatar from "../user/Avatar";
import { PROJECT_UNSPLASH_COVERS } from "@/lib/constants";
import { ProjectDto } from "@/generated/dto/project-dto";

interface IProps {
  project: ProjectDto;
}

const ProjectCard: FC<IProps> = ({ project }) => {
  return (
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
        <div className="w-auto">
          <Tooltip
            title={
              <div className="flex flex-col items-center gap-1">
                <h1>Members</h1>
                {/* <p>{`${project.members.length} members`}</p> */}
              </div>
            }
          >
            {/* {project.members.map((user) => (
              <UserAvatar user={user} key={user.id} />
            ))} */}
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
