import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GearIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";

const SettingsHeader = () => {
  const router = useRouter();
  const workspace = router.query.workspaceSlug;
  return (
    <div className="h-14 p-4 flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Workspaces</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="flex gap-2 items-center"
                href={`/${workspace}/projects`}
              >
                {workspace}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex gap-2 items-center">
                <GearIcon className="h-4 w-4 stroke-[1.5]" />
                Settings
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default SettingsHeader;
