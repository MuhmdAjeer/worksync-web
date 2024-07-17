import IssuesHeader from "@/components/headers/IssuesHeader";
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
import React, { ReactElement } from "react";

const Page: NextPageWithLayout = observer(() => {
  const { projectId } = useAppRouter();
  const { data } = useProjectIssues(projectId!);
  const { mutate: updateIssue } = useUpdateIssue();

  const updateHandler = (data: Omit<IUpdateIssue, "projectId">) => {
    if (!projectId) return;
    updateIssue({ projectId, ...data });
  };

  if (!data) return <></>;

  return (
    <div className="p-4">
      <IssueTable columns={columns({ onUpdate: updateHandler })} data={data} />
    </div>
  );
});

Page.getLayout = function getLayout(children: ReactElement) {
  return <AppLayout header={<IssuesHeader />}>{children}</AppLayout>;
};

export default Page;
