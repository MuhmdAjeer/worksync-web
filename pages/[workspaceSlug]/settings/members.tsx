import SettingsHeader from "@/components/headers/SettingsHeader";
import { SettingsLayout } from "@/components/layouts/app/WorkspaceSettingsLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ReactElement, useCallback, useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWorkspaceMembers } from "@/hooks/workspaces";
import { format } from "date-fns";
import {
  useInvitationsList,
  useRemoveInvitation,
  useUpdateInvitation,
} from "@/hooks/invitations";
import { useRouter } from "next/router";
import InviteMemberModal from "@/components/settings/InviteMemberModal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleEnum } from "@/generated/dto/invitation-dto";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { XCircleIcon } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UpdateInvitationDto } from "@/generated/dto/update-invitation-dto";
import { confirmAlert } from "@/components/modal/confirmAlert";
import _, { debounce } from "lodash";

const MembersPage = () => {
  const { workspaceSlug } = useRouter().query;
  const [username, setUsername] = useState("");
  const { data: workspaceMembers } = useWorkspaceMembers(
    workspaceSlug?.toString()!,
    { username },
  );
  const { data: pendingInvitations } = useInvitationsList(
    workspaceSlug?.toString()!,
    {
      is_accepted: false,
    },
  );

  const { mutate: updateInvitation } = useUpdateInvitation();
  const { mutate: removeInvitation } = useRemoveInvitation();
  const [modal, setModal] = useState(false);

  const handleUpdateInvitation = (id: string, data: UpdateInvitationDto) => {
    if (!workspaceSlug) return;
    updateInvitation({ data, id, slug: workspaceSlug.toString() });
  };

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setUsername(value), 500), // 500ms debounce delay
    [],
  );

  return (
    <section className="w-full">
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
              setModal(true);
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
            {workspaceMembers?.map((member) => (
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
      {pendingInvitations?.length && (
        <div className="my-8">
          <h1 className="text-lg font-semibold my-4">
            Pending Invites
            <span className="text-xs bg-custom-primary-dark/10 text-custom-primary-dark rounded px-2 py-0.5 ml-2">
              {pendingInvitations?.length}{" "}
            </span>
          </h1>
          <div className="gap-2 flex flex-col">
            {pendingInvitations?.map((invite) => (
              <div
                className="flex justify-between p-2 group px- bg-secondary/40 hover:bg-secondary rounded-md items-center"
                key={invite.id}
              >
                <div className="flex gap-2 items-center">
                  <Avatar>
                    <AvatarImage src="" alt={invite.email} />
                    <AvatarFallback>{invite.email.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h1 className="text-sm">{invite.email}</h1>
                </div>
                <div className="flex gap-3 items-center">
                  <Select
                    value={invite.role}
                    onValueChange={(value: RoleEnum) =>
                      handleUpdateInvitation(invite.id, { role: value })
                    }
                  >
                    <SelectTrigger className="w-[105px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Role</SelectLabel>
                        <SelectItem value={RoleEnum.Admin}>Admin</SelectItem>
                        <SelectItem value={RoleEnum.Member}>Member</SelectItem>
                        <SelectItem value={RoleEnum.Guest}>Guest</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        className="invisible group-hover:visible"
                        size={"icon"}
                        onClick={() => {
                          if (!workspaceSlug) return;
                          confirmAlert().then(() => {
                            removeInvitation({
                              slug: workspaceSlug.toString(),
                              id: invite.id,
                            });
                          });
                        }}
                        variant="ghost"
                      >
                        <XCircleIcon className="text-destructive/70 h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove Invite</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <InviteMemberModal
        onClose={() => {
          setModal(false);
        }}
        workspace={workspaceSlug?.toString()}
        open={modal}
      />
    </section>
  );
};

MembersPage.getLayout = function getLayout(children: ReactElement) {
  return (
    <SettingsLayout header={<SettingsHeader />}>{children}</SettingsLayout>
  );
};

export default MembersPage;
