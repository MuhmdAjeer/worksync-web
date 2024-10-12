import React, { useState } from "react";
import { Input } from "../ui/input";
import IssueStatesDropdown from "./IssueStateDropdown";
import IssuePriorityDropdown from "./IssuePriorityDropdown";
import ProjectMembersDropdown from "../Multiselect/ProjectMembers";
import { Controller, UseFormReturn } from "react-hook-form";
import DatePicker from "../ui/datePicker";
import { Button } from "../ui/button";
import Tiptap from "../Editor";
import { CreateIssueDto, PriorityEnum } from "@/generated/dto/create-issue-dto";
import { IssueDto } from "@/generated/dto/issue-dto";
import IssueLabelDropdown from "./IssueLabelDropdown";

interface IForm {
  form: UseFormReturn<CreateIssueDto, any, undefined>;
  activeProjectId: string;
  issue?: IssueDto;
}

const IssueForm: React.FC<IForm> = ({ form, activeProjectId, issue }) => {
  const [stateDropdown, setStateDropdown] = useState(false);
  const [priorityDropdown, setPriorityDropdown] = useState(false);

  const minDate = form.watch("start_date");
  const maxDate = form.watch("end_date");

  return (
    <div className="w-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Controller
            control={form.control}
            name="title"
            rules={{
              required: "Title is required",
              maxLength: {
                value: 120,
                message: "Title is too long",
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                name="Title"
                placeholder="Title"
                message={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="description"
            defaultValue={issue?.description}
            render={({ field }) => (
              <Tiptap value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <div className="flex items-center w-full gap-2 justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <Controller
              control={form.control}
              name="state"
              render={({ field: { onChange, value } }) => (
                <IssueStatesDropdown
                  projectId={activeProjectId}
                  open={stateDropdown}
                  defaultValue={issue?.state?.id}
                  onOpenChange={(v) => setStateDropdown(v)}
                  onChange={(value) => {
                    onChange(value.id);
                  }}
                />
              )}
            />
            <Controller
              control={form.control}
              name="priority"
              render={({ field: { onChange } }) => (
                <IssuePriorityDropdown
                  open={priorityDropdown}
                  label="Priority"
                  defaultValue={issue?.priority}
                  buttonVariant={"ghost"}
                  onOpenChange={(v) => setPriorityDropdown(v)}
                  onChange={(value) => {
                    onChange(value.name);
                  }}
                />
              )}
            />
            <Controller
              control={form.control}
              name="label_ids"
              defaultValue={
                issue?.labels ? issue?.labels?.map((x) => x.id) : []
              }
              render={({ field: { onChange, value } }) => (
                <IssueLabelDropdown
                  value={value ?? []}
                  projectId={activeProjectId}
                  onChange={onChange}
                  label="Labels"
                  buttonVariant="outline"
                  showIcons={value && value?.length > 0}
                />
              )}
            />

            <Controller
              name="assignees_id"
              control={form.control}
              defaultValue={issue?.assignees?.map((x) => x.id)}
              render={({ field: { value, onChange } }) => (
                <ProjectMembersDropdown
                  projectId={activeProjectId}
                  value={value ?? []}
                  label="Assignees"
                  multiple
                  showIcons
                  dropdownArrow={false}
                  buttonVariant="outline"
                  onChange={onChange}
                />
              )}
            />
            <Controller
              control={form.control}
              name="start_date"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="Start Date"
                  value={value}
                  onChange={onChange}
                  maxDate={maxDate}
                  buttonVariant={"outline"}
                />
              )}
            />
            <Controller
              control={form.control}
              name="end_date"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="End Date"
                  value={value}
                  minDate={minDate}
                  onChange={onChange}
                  buttonVariant={"outline"}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueForm;
