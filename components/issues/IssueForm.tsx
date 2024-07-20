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

interface IForm {
  form: UseFormReturn<CreateIssueDto, any, undefined>;
  handleFormSubmit: (data: CreateIssueDto) => void;
  activeProjectId: string;
  isPending?: boolean;
  issue?: IssueDto;
  isEditing?: boolean;
}

const IssueForm: React.FC<IForm> = ({
  form,
  handleFormSubmit,
  activeProjectId,
  isPending,
  isEditing,
  issue,
}) => {
  const [stateDropdown, setStateDropdown] = useState(false);
  const [priorityDropdown, setPriorityDropdown] = useState(false);

  const minDate = form.watch("start_date");
  const maxDate = form.watch("end_date");

  const isSubmitting = form.formState.isSubmitting;
  const buttonTitle = isEditing ? "Update Issue" : "Add Issue";
  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
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
        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-2 items-center">
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
                  defaultValue={issue?.priority}
                  onOpenChange={(v) => setPriorityDropdown(v)}
                  onChange={(value) => {
                    onChange(value.name);
                  }}
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
                />
              )}
            />
          </div>
          <Button disabled={isPending || isSubmitting} type="submit" size="sm">
            {isPending || isSubmitting ? "Submitting..." : buttonTitle}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default IssueForm;
