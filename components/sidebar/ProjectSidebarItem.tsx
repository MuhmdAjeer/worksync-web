import { Project } from "@/generated/dto/project";
import { observer } from "mobx-react";
import Link from "next/link";
import React from "react";
import ProjectLogo from "../projects/ProjectLogo";

interface IProps {
  project: Project;
}

const ProjectSidebarItem = observer(({ project }: IProps) => {
  return (
    <Link key={project.id} href="hi">
      <span className="my-1 block w-full">
        <div
          className={`group flex w-full items-center gap-2.5 rounded-md px-3 py-1 text-sm font-medium outline-none ${"text-foreground hover:bg-foreground/5 focus:bg-foreground/50"}  `}
        >
          <ProjectLogo value={project.logo} />
          <p className="leading-5 text-sm">{project.name}</p>
        </div>
      </span>
    </Link>
  );
});

export default ProjectSidebarItem;
