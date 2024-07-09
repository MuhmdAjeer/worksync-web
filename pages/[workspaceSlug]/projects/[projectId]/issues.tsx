import IssuesHeader from "@/components/headers/IssuesHeader";
import { AppLayout } from "@/components/layouts/app/AppLayout";
import { IssueTable } from "@/components/table/IssuesTable";
import { Payment, columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { useProjectIssues } from "@/hooks/issue";
import { useAppRouter } from "@/hooks/router";
import { NextPageWithLayout } from "@/pages/_app";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const Page: NextPageWithLayout = observer(() => {
  const { projectId } = useAppRouter();
  const { data } = useProjectIssues(projectId!);

  if (!data) return <></>;

  return (
    <div>
      <IssueTable columns={columns} data={data} />
    </div>
  );
});

Page.getLayout = function getLayout(children: ReactElement) {
  return <AppLayout header={<IssuesHeader />}>{children}</AppLayout>;
};

export default Page;
