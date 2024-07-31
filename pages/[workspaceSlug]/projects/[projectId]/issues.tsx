import IssuesHeader from "@/components/headers/IssuesHeader";
import CreateIssueModal from "@/components/issues/create-issue-modal";
import UpdateIssueModal from "@/components/issues/update-issue-modal";
import IssueFilter from "@/components/issues/view/IssueFilter";
import { AppLayout } from "@/components/layouts/app/AppLayout";
import { IssueTable } from "@/components/table/IssuesTable";
import { Payment, columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { IssueDto } from "@/generated/dto/issue-dto";
import { UpdateIssueDto } from "@/generated/dto/update-issue-dto";
import {
  IUpdateIssue,
  useInfiniteProjectIssues,
  useProjectIssues,
  useUpdateIssue,
} from "@/hooks/issue";
import { useAppRouter } from "@/hooks/router";
import { NextPageWithLayout } from "@/pages/_app";
import { ListFilter, SlidersHorizontal } from "lucide-react";
import { observer } from "mobx-react";
import React, { ReactElement, useState } from "react";

const Page: NextPageWithLayout = observer(() => {
  const { projectId } = useAppRouter();
  const { data, isFetching, fetchNextPage } = useInfiniteProjectIssues(
    projectId!,
    {
      pageSize: 25,
    }
  );
  const [issue, setIssue] = useState<IssueDto | null>(null);
  const { mutate: updateIssue } = useUpdateIssue();

  const updateHandler = (data: Omit<IUpdateIssue, "projectId">) => {
    if (!projectId) return;
    updateIssue({ projectId, ...data });
  };
  const issues = React.useMemo(
    // @ts-ignore
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        console.log({ scrollHeight, scrollTop, clientHeight });

        if (scrollHeight - scrollTop - clientHeight < 600 && !isFetching) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching]
  );

  if (!data) return <></>;

  return (
    <div className="p-2 h-full">
      <div className="flex gap-4 items-center my-2">
        <IssueFilter>
          <Button className="flex gap-2 group" variant="secondary" size="xs">
            <ListFilter className="h-4 w-4 text-primary/50 group-hover:text-primary" />
            <span>Filter</span>
          </Button>
        </IssueFilter>
        <Button className="flex gap-2 group" variant="secondary" size="xs">
          <SlidersHorizontal className="h-4 w-4 text-primary/50 group-hover:text-primary" />
          <span>Display</span>
        </Button>
      </div>
      <IssueTable
        columns={columns({
          onUpdate: updateHandler,
          handleOpenIssue: (issue) => {
            setIssue(issue);
          },
        })}
        fetch={fetchMoreOnBottomReached}
        data={issues}
      />
      {issue && (
        <UpdateIssueModal
          onClose={() => setIssue(null)}
          issue={issue}
          open={!!issue}
          key={issue?.id}
        />
      )}
    </div>
  );
});

Page.getLayout = function getLayout(children: ReactElement) {
  return <AppLayout header={<IssuesHeader />}>{children}</AppLayout>;
};

export default Page;
