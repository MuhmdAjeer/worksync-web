import IssuesHeader from "@/components/headers/IssuesHeader";
import CreateIssueModal from "@/components/issues/create-issue-modal";
import { AppLayout } from "@/components/layouts/app/AppLayout";
import { IssueTable } from "@/components/table/IssuesTable";
import { Payment, columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { UpdateIssueDto } from "@/generated/dto/update-issue-dto";
import { IUpdateIssue, useProjectIssues, useUpdateIssue } from "@/hooks/issue";
import { useAppRouter } from "@/hooks/router";
import { NextPageWithLayout } from "@/pages/_app";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";

const Page: NextPageWithLayout = observer(() => {
  const { projectId } = useAppRouter();
  const { data } = useProjectIssues(projectId!);
  const { mutate: updateIssue } = useUpdateIssue();
  const [issue, setIssue] = useState<string | null>(null);

  const updateHandler = (data: Omit<IUpdateIssue, "projectId">) => {
    if (!projectId) return;
    updateIssue({ projectId, ...data });
  };

  if (!data) return <></>;

  return (
    <div className="p-4">
      <IssueTable
        columns={columns({
          onUpdate: updateHandler,
          handleOpenIssue: (issue) => {
            setIssue(issue);
          },
        })}
        data={data}
      />
      <CreateIssueModal
        onClose={() => setIssue(null)}
        open={!!issue}
        key={issue}
      />
    </div>
  );
});

Page.getLayout = function getLayout(children: ReactElement) {
  return <AppLayout header={<IssuesHeader />}>{children}</AppLayout>;
};

export default Page;
