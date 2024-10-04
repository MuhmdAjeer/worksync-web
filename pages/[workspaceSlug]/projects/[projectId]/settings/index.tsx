import { NextPageWithLayout } from "@/pages/_app";
import { observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import SettingsHeader from "@/components/headers/SettingsHeader";
import { ProjectSettings as Layout } from "@/components/layouts/app/ProjectSettings";

const ProjectSettings: NextPageWithLayout = observer(() => {
  return <h1>Project General Settings</h1>;
});

ProjectSettings.getLayout = function getLayout(children: ReactElement) {
  return <Layout header={<SettingsHeader />}>{children} </Layout>;
};

export default ProjectSettings;
