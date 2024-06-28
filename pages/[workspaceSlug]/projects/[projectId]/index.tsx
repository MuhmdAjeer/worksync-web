import ProjectHeader from "@/components/headers/ProjectHeader";
import CreateIssueModal from "@/components/issues/create-issue-modal";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/layouts/app/AppLayout";
import React, { ReactElement, useState } from "react";

const Page = () => {
  const [openIssueModal, ToggleIssueModal] = useState(false);
  return (
    <div className="space-y-7 md:p-7 p-3 bg-custom-background-90 h-full w-full flex flex-col overflow-y-auto">
      <div className="text-center items-center h-full">
        <Button onClick={() => ToggleIssueModal(true)}>
          Create your first issue
        </Button>
        <CreateIssueModal
          open={openIssueModal}
          onClose={() => {
            ToggleIssueModal(false);
          }}
        />
      </div>
    </div>
  );
};

Page.getLayout = function getLayout(children: ReactElement) {
  return <AppLayout header={<ProjectHeader />}>{children}</AppLayout>;
};

export default Page;
