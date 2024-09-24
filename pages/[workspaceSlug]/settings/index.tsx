import { NextPageWithLayout } from "@/pages/_app";
import { observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import SettingsHeader from "@/components/headers/SettingsHeader";
import { SettingsLayout } from "@/components/layouts/app/WorkspaceSettingsLayout";

const WorkspaceSettings: NextPageWithLayout = observer(() => {
  return <h1>hi</h1>;
});

WorkspaceSettings.getLayout = function getLayout(children: ReactElement) {
  return (
    <SettingsLayout header={<SettingsHeader />}>{children} </SettingsLayout>
  );
};

export default WorkspaceSettings;
