import SettingsHeader from "@/components/headers/SettingsHeader";
import { SettingsLayout } from "@/components/layouts/app/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ReactElement } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWorkspaceMembers } from "@/hooks/workspaces";
import { useAppRouter } from "@/hooks/router";
import { format } from "date-fns";
import { useInvitationsList } from "@/hooks/invitations";
import { useRouter } from "next/router";

const MembersPage = () => {
  const { workspaceSlug } = useRouter().query;
  const { data: workspaceMembers } = useWorkspaceMembers(
    workspaceSlug?.toString()!
  );
  const { data } = useInvitationsList(workspaceSlug?.toString()!, {
    is_accepted: false,
  });

  return (
    <section className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="font-semibold">Members</h1>
        <div className="flex gap-2">
          <Input name="search" placeholder="Search Members" />
          <Button>Add Member</Button>
        </div>
      </div>
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead>Joining Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaceMembers?.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.user.username}</TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  {member.created_at && format(member.created_at, "PPP")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="m-8">
        <h1>Pending Invites</h1>
      </div>
    </section>
  );
};

MembersPage.getLayout = function getLayout(children: ReactElement) {
  return (
    <SettingsLayout header={<SettingsHeader />}>{children}</SettingsLayout>
  );
};

export default MembersPage;
