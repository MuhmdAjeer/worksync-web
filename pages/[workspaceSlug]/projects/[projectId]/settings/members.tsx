import { NextPageWithLayout } from "@/pages/_app";
import { observer } from "mobx-react";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import SettingsHeader from "@/components/headers/SettingsHeader";
import { ProjectSettings as Layout } from "@/components/layouts/app/ProjectSettings";
import { useProjectMembers } from "@/hooks/projects";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import _, { debounce } from "lodash";
import AddMemberModal from "@/components/projects/AddMemberModal";

const ProjectSettings: NextPageWithLayout = observer(() => {
  const { projectId } = useRouter().query;
  const [name, setName] = useState("");
  const [addModal, setAddModal] = useState(false);

  const { data: members } = useProjectMembers(projectId?.toString()!, {
    username: name,
  });
  const debouncedSearch = useMemo(
    () => debounce((value: string) => setName(value), 500),
    [],
  );

  return (
    <section className="w-full">
      <AddMemberModal projectId={projectId?.toString()} onClose={() => setAddModal(false)} open={addModal} />
      <div className="flex w-full items-center justify-between">
        <h1 className="font-semibold">Members</h1>
        <div className="flex gap-2">
          <Input
            name="search"
            onChange={(e) => debouncedSearch(e.target.value)}
            placeholder="Search Members"
          />
          <Button
            onClick={() => {
              setAddModal(true);
            }}
          >
            Add Member
          </Button>
        </div>
      </div>
      <div className="mt-4">
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
            {members?.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Avatar>
                      <AvatarImage
                        src={member.user.profile_picture}
                        alt={"Profile Picture"}
                      />
                      <AvatarFallback>
                        {member.user.username?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-sm">{member.user.username}</h1>
                  </div>
                </TableCell>
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
    </section>
  );
});

ProjectSettings.getLayout = function getLayout(children: ReactElement) {
  return <Layout header={<SettingsHeader />}>{children} </Layout>;
};

export default ProjectSettings;
