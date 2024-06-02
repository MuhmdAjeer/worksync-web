import { Project } from "@/generated/dto/project";
import { observer } from "mobx-react";
import Link from "next/link";
import React from "react";

interface IProps {
  project: Project;
}

const ProjectSidebarItem = observer(({ project }: IProps) => {
  return (
    <Link key={project.id} href="hi">
      <span className="my-1 block w-full">
        <div
          className={`group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium outline-none ${"text-foreground hover:bg-foreground/5 focus:bg-foreground/50"}  `}
        >
          <p className="leading-5">{project.name}</p>
        </div>
      </span>
    </Link>
  );
});

export default ProjectSidebarItem;
