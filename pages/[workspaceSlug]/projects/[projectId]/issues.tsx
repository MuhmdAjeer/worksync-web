import IssuesHeader from "@/components/headers/IssuesHeader";
import { AppLayout } from "@/components/layouts/app/AppLayout";
import { Payment, columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { useProjectIssues } from "@/hooks/issue";
import { useAppRouter } from "@/hooks/router";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const Page = observer(() => {
  const { projectId } = useAppRouter();
  const { data } = useProjectIssues(projectId!);

  return (
    <div className="container mx-auto py-10">
      <h1>hi</h1>
      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
});

Page.getLayout = function getLayout(children: ReactElement) {
  return <AppLayout header={<IssuesHeader />}>{children}</AppLayout>;
};

export default Page;
