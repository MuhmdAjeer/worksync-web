import ProjectHeader from "@/components/headers/ProjectHeader";
import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectModal from "@/components/projects/create-project-modal";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/projects";
import { useAppRouter } from "@/hooks/router";
import { AppLayout } from "@/components/layouts/app/AppLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import SettingsHeader from "@/components/headers/SettingsHeader";
import { SettingsLayout } from "@/components/layouts/app/SettingsLayout";

const WorkspaceSettings: NextPageWithLayout = observer(() => {
	return <h1>hi</h1>;
});

WorkspaceSettings.getLayout = function getLayout(children: ReactElement) {
	return (
		<SettingsLayout header={<SettingsHeader />}>{children} </SettingsLayout>
	);
};

export default WorkspaceSettings;
