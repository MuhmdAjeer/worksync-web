import React from "react";
import IssueStatesDropdown from "./IssueStateDropdown";
import {
  CalendarCheck2,
  CalendarClock,
  SignalHigh,
  TagIcon,
  User,
  Users,
} from "lucide-react";
import IssueLabelDropdown from "./IssueLabelDropdown";
import LabelBadge from "./label/label-badge";
import ProjectMembersDropdown from "../Multiselect/ProjectMembers";
import IssuePriorityDropdown from "./IssuePriorityDropdown";
import DatePicker from "../ui/datePicker";
import ButtonAvatar from "../user/ButtonAvatars";
import { IssueDto } from "@/generated/dto/issue-dto";
import { useMember } from "@/hooks/user";

interface IProps {
  issue: IssueDto;
}

const IssueProperties: React.FC<IProps> = ({ issue }) => {
  const createdUser = useMember(issue.issued_by);
  return (
    <div>
      <IssueStatesDropdown projectId={issue.Project.id} onChange={() => {}} />
      <div className="w-full border rounded-lg flex flex-col gap-2 my-4 h-auto mb-4 px-4 py-2">
        <div className="flex w-full  justify- items-center flex-shrink-0 gap-4">
          <div className="w-1/4 text-sm text-primary/70 flex items-center gap-1 flex-shrink-0">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>Assignees</span>
          </div>

          <ProjectMembersDropdown
            label="Assignees"
            value={issue.assignees.map((x) => x.id)}
            projectId={issue.Project.id}
            onChange={() => {}}
            dropdownArrow={false}
            showIcons={issue.assignees.length > 0}
            buttonClassName="w-3/4 justify-start"
            buttonVariant="ghost"
          />
        </div>
        <div className="flex w-full  justify- items-center flex-shrink-0 gap-2">
          <div className="w-1/4 text-sm text-primary/70 flex items-center gap-2 flex-shrink-0">
            <TagIcon className="h-4 w-4 flex-shrink-0" />
            <span>Labels</span>
          </div>
          <IssueLabelDropdown
            onChange={function (value: string[]): void {}}
            projectId={issue.Project.id}
            value={issue.labels?.map((x) => x.id) ?? []}
            label={"Labels"}
            button={
              <div className="w-3/4 px-4 flex gap-2 flex-wrap">
                {issue.labels?.map((label) => (
                  <LabelBadge key={label.id} label={label} />
                ))}
              </div>
            }
          />
        </div>
        <div className="flex w-full  justify- items-center flex-shrink-0 gap-4">
          <div className="w-1/4 text-sm text-primary/70 flex items-center gap-1 flex-shrink-0">
            <SignalHigh className="h-4 w-4 flex-shrink-0" />
            <span>Priority</span>
          </div>

          <IssuePriorityDropdown
            label={"Priority"}
            buttonClassName="w-3/4 justify-start"
            buttonVariant={"ghost"}
            buttonSize="xs"
          />
        </div>

        <div className="flex w-full  justify- items-center flex-shrink-0 gap-4">
          <div className="w-1/4 text-sm text-primary/70 flex items-center gap-1 flex-shrink-0">
            <CalendarClock className="h-4 w-4 flex-shrink-0" />
            <span>Start Date</span>
          </div>

          <DatePicker
            showIcons={false}
            label="Start Date"
            onChange={() => {}}
            buttonClassName="w-3/4"
            buttonSize="xs"
          />
        </div>
        <div className="flex w-full  justify- items-center flex-shrink-0 gap-4">
          <div className="w-1/4 text-sm text-primary/70 flex items-center gap-1 flex-shrink-0">
            <CalendarCheck2 className="h-4 w-4 flex-shrink-0" />
            <span>End Date</span>
          </div>

          <DatePicker
            showIcons={false}
            label="End Date"
            onChange={() => {}}
            buttonClassName="w-3/4"
            buttonSize="xs"
          />
        </div>
        <div className="flex w-full  justify- items-center flex-shrink-0 gap-1">
          <div className="w-1/4 text-sm text-primary/70 flex items-center gap-1 flex-shrink-0">
            <User className="h-4 w-4 flex-shrink-0" />
            <span>Created By</span>
          </div>
          <div className="flex gap-1 px-4">
            <ButtonAvatar userIds={issue.issued_by} />
            <span className="flex-grow truncate text-xs leading-5">
              {createdUser?.user.username}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueProperties;
