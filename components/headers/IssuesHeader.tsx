import React, { useState } from "react";
import { Button } from "../ui/button";
import { ThemeModelToggle } from "../common/ThemeModeToggle";
import CreateIssueModal from "../issues/create-issue-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCurrentProject } from "@/hooks/projects";
import { useAppRouter } from "@/hooks/router";
import ProjectLogo from "../projects/ProjectLogo";
import { CardStackIcon } from "@radix-ui/react-icons";
import { Layers3Icon, LayersIcon } from "lucide-react";
import IssueFilterDropdown from "../IssueFilterDropdown";

const IssuesHeader = () => {
  const [openModal, setOpenModal] = useState(false);
  const { data: project } = useCurrentProject();
  const { workspaceSlug, projectId } = useAppRouter();
  return (
    <div className="h-14 p-4 flex items-center justify-between">
      <div className="flex gap-2 items-center">
        {/* <BriefcaseIcon className="h-5 w-5" />
        <Typography variant="h6">Issues</Typography> */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="flex gap-2 items-center"
                href={`/${workspaceSlug}/projects`}
              >
                <ProjectLogo value={project?.logo} />
                {project?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex gap-2 items-center">
                <LayersIcon className="h-4 w-4 stroke-[1.5]" />
                Issues
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-4">
        <IssueFilterDropdown label="Filter" onChange={() => {}} />
        <Button
          onClick={() => {
            setOpenModal(true);
          }}
          size="sm"
        >
          Add Issue
        </Button>
        <ThemeModelToggle />
      </div>
      <CreateIssueModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
};

export default IssuesHeader;
