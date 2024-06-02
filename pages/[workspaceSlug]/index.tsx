import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import { AppLayout } from "@/layouts/app/AppLayout";
import { observer } from "mobx-react";
import { useWorkspace } from "@/hooks/workspace";
import { useAppRouter } from "@/hooks/router";
import { useProject } from "@/hooks/project";

const Page: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const { workspaceSlug } = useAppRouter();
  return (
    <div className="space-y-7 md:p-7 p-3 bg-custom-background-90 h-full w-full flex flex-col overflow-y-auto">
      {workspaceSlug}
      <p>curent : {currentWorkspace?.name}</p>
    </div>
  );
});

Page.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;
