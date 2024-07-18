import { observer } from "mobx-react";
import Link from "next/link";
import React from "react";
import ProjectLogo from "../projects/ProjectLogo";
import {
  Transition,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  CameraIcon,
  ContrastIcon,
  Dice1Icon,
  FileText,
  Inbox,
  LayersIcon,
  Settings,
  VideotapeIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import { ProjectDto } from "@/generated/dto/project-dto";

interface IProps {
  project: ProjectDto;
}

const projectLinks = (workspaceSlug: string, projectId: string) => {
  return [
    // {
    //   name: "Call",
    //   href: `/${workspaceSlug}/projects/${projectId}/video-call`,
    //   Icon: CameraIcon,
    // },
    {
      name: "Issues",
      href: `/${workspaceSlug}/projects/${projectId}/issues`,
      Icon: LayersIcon,
    },
    {
      name: "Cycles",
      href: `/${workspaceSlug}/projects/${projectId}/cycles`,
      Icon: ContrastIcon,
    },
    {
      name: "Modules",
      href: `/${workspaceSlug}/projects/${projectId}/modules`,
      Icon: Dice1Icon,
    },
    {
      name: "Pages",
      href: `/${workspaceSlug}/projects/${projectId}/pages`,
      Icon: FileText,
    },
    {
      name: "Inbox",
      href: `/${workspaceSlug}/projects/${projectId}/inbox`,
      Icon: Inbox,
    },
    {
      name: "Settings",
      href: `/${workspaceSlug}/projects/${projectId}/settings`,
      Icon: Settings,
    },
  ];
};

const ProjectSidebarItem = observer(({ project }: IProps) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;
  return (
    // <Link key={project.id} href="hi">
    <Disclosure as="div" className="w-full">
      <DisclosureButton  className="w-full outline-none">
        <span className="my-1 block w-full">
          <div
            className={`group flex w-full items-center gap-2.5 rounded-md px-3 py-0.5 text-xs font-medium outline-none ${"text-foreground hover:bg-foreground/5 focus:bg-foreground/50"}  `}
          >
            <ProjectLogo value={project.logo} />
            <p className="leading-5">{project.name}</p>
          </div>
        </span>
      </DisclosureButton>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <DisclosurePanel>
          <div className="border p-2 rounded-lg shadow-sm">
            {projectLinks(workspaceSlug as string, project.id).map((menu) => (
              <Link key={menu.name} href={menu.href}>
                <span className="block w-full">
                  <div
                    className={`group flex items-center gap-2.5 rounded-md px-2 py-1.5 mt-0.5 text-xs font-medium outline-none ${
                      router.asPath.includes(menu.href)
                        ? "bg-secondary"
                        : " hover:bg-secondary focus:bg-primary/5"
                    }`}
                  >
                    <menu.Icon className="h-4 w-4 stroke-[1.5]" />
                    {menu.name}
                  </div>
                </span>
              </Link>
            ))}
          </div>
        </DisclosurePanel>
      </Transition>
    </Disclosure>
    // </Link>
  );
});

export default ProjectSidebarItem;
