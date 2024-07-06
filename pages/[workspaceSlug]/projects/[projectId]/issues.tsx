import IssuesHeader from "@/components/headers/IssuesHeader";
import { AppLayout } from "@/components/layouts/app/AppLayout";
import React, { ReactElement } from "react";

const Page = () => {
  return <div>Issues</div>;
};

Page.getLayout = function getLayout(children: ReactElement) {
  return <AppLayout header={<IssuesHeader />}>{children}</AppLayout>;
};

export default Page;
