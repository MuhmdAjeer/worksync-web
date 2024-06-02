import { useProject } from "@/hooks/project";
import { useAppRouter } from "@/hooks/router";
import { useWorkspace } from "@/hooks/workspace";
import { WorkspaceService } from "@/services/workspace.service";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect, useState } from "react";
import useSWR from "swr";

const WorkspaceWrapper = observer((props: PropsWithChildren) => {
  const { children } = props;
  const { fetchProjects } = useProject();
  const router = useRouter();
  const { workspaceSlug } = router.query;
  const { fetchMyWorkspaces, workspaces } = useWorkspace();
  const allWorkspaces = Object.values(workspaces ?? {});
  const currentWorkspace = allWorkspaces.find((x) => x.name === workspaceSlug);

  const x = useSWR(`WORKSPACE_${workspaceSlug}`, fetchMyWorkspaces, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  // useSWR(
  //   workspaceSlug && currentWorkspace
  //     ? `WORKSPACE_PROJECTS_${currentWorkspace.id}`
  //     : null,
  //   () => fetchProjects(currentWorkspace?.id!),
  //   {
  //     revalidateIfStale: false,
  //     revalidateOnFocus: false,
  //   }
  // );
  useSWR(
    currentWorkspace && workspaceSlug
      ? `WORKSPACE_PROJECTS_${workspaceSlug.toString()}`
      : null,
    currentWorkspace && workspaceSlug
      ? () => fetchProjects(currentWorkspace?.id)
      : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: true,
    }
  );

  if (allWorkspaces === undefined) {
    return <h1>loading</h1>;
  }
  if (!currentWorkspace) {
    return <h1>notohinf</h1>;
  }

  if (x.isLoading) {
    return <h1>loading</h1>;
  }

  if (x.data && !currentWorkspace) {
    return <h1>You dont have a workspace! please create one</h1>;
  }

  if (x.error && !x.data) {
    return <h1>{"error"}</h1>;
  }

  return children;
});

export default WorkspaceWrapper;
