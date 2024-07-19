import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { IssueDto } from "@/generated/dto/issue-dto";
import IssueStateIcon from "../icons/IssueStateIcon";
import { RStack } from "../common/Stack";
import IssuePriorityDropdown, {
  priorities,
} from "../issues/IssuePriorityDropdown";
import { Calendar } from "../ui/calendar";
import DatePicker from "../ui/datePicker";
import { Button } from "../ui/button";
import { UpdateIssueDto } from "@/generated/dto/update-issue-dto";
import { IUpdateIssue } from "@/hooks/issue";
import { cn } from "@/lib/utils";
import { PriorityEnum } from "@/generated/dto/create-issue-dto";
import IssueStatesDropdown from "../issues/IssueStateDropdown";
import CreateIssueModal from "../issues/create-issue-modal";
import { useState } from "react";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

type TArgs = {
  onUpdate?: (data: Omit<IUpdateIssue, "projectId">) => void;
  handleOpenIssue?: (issue: IssueDto) => void;
};

export const columns = (options?: TArgs): ColumnDef<IssueDto>[] => {
  return [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => null,
    // },
    {
      accessorKey: "id",
      header: ({ table }) => (
        <div className="flex items-center gap-6 w-max p-0">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            className="data-[state=checked]:bg-custom-primary data-[state=checked]:text-white data-[state=checked]:border-custom-primary"
            // className="bg-amber-300"
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell({ row }) {
        return (
          <div className="flex items-center gap-6 group">
            <Checkbox
              className={cn(
                // row.getIsSelected() ? "visible" : "invisible",
                "group-hover:visible data-[state=checked]:bg-custom-primary data-[state=checked]:text-white data-[state=checked]:border-custom-primary"
              )}
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: ({ table }) => (
        <div className="flex items-center gap-6">
          <h1>Issues</h1>
        </div>
      ),
      cell({ row }) {
        return (
          <div
            onClick={() => {
              if (options?.handleOpenIssue) {
                options.handleOpenIssue(row.original);
              }
            }}
            className="flex items-center w-full gap-6 group"
          >
            <h1>{row.original.Project.custom_id}</h1>
            <h1>{row.original.title}</h1>
          </div>
        );
      },
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => {
        const state = row.original.state;
        return (
          <IssueStatesDropdown
            variant="ghost"
            className="hover:bg-transparent w-full"
            projectId={row.original.Project.id}
            defaultValue={state?.id}
            onChange={(value) => {
              if (options?.onUpdate) {
                options.onUpdate({
                  issueId: row.original.id,
                  state: value.id,
                });
              }
            }}
          />
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        return (
          <IssuePriorityDropdown
            className="hover:bg-transparent justify-between w-full"
            variant="ghost"
            defaultValue={row.original.priority}
            onChange={(value) => {
              if (options?.onUpdate) {
                options.onUpdate({
                  issueId: row.original.id,
                  priority: value.name as PriorityEnum,
                });
              }
            }}
          />
        );
      },
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row: { original } }) => {
        return (
          <DatePicker
            variant="ghost"
            className="hover:bg-0"
            value={original.start_date && new Date(original.start_date)}
            label={
              original.start_date
                ? format(original.start_date, "PPP")
                : "Start Date"
            }
            onChange={(value) => {
              if (options?.onUpdate) {
                options.onUpdate({ issueId: original.id, start_date: value });
              }
            }}
          />
        );
      },
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ row: { original } }) => {
        return (
          <DatePicker
            variant="ghost"
            className="hover:bg-0"
            value={original.end_date && new Date(original.end_date)}
            label={
              original.end_date ? format(original.end_date, "PPP") : "End Date"
            }
            onChange={(value) => {
              if (options?.onUpdate) {
                options.onUpdate({ issueId: original.id, end_date: value });
              }
            }}
          />
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Issued on",
      cell: ({ row: { original } }) => {
        if (!original.created_at) return;
        return (
          <div>
            <h1>{format(original.created_at, "PPP")}</h1>
          </div>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: "Updated on",
      cell: ({ row: { original } }) => {
        if (!original.updated_at) return;
        return (
          <div>
            <h1>{format(original.updated_at, "PPP")}</h1>
          </div>
        );
      },
    },

    // {
    //   accessorKey: "amount",
    //   header: () => <div className="text-right">Amount</div>,
    //   cell: ({ row }) => {
    //     const amount = parseFloat(row.getValue("amount"));
    //     const formatted = new Intl.NumberFormat("en-US", {
    //       style: "currency",
    //       currency: "USD",
    //     }).format(amount);

    //     return <div className="text-right font-medium">{formatted}</div>;
    //   },
    // },
    // {
    //   id: "actions",
    //   cell: ({ row }) => {
    //     const payment = row.original;

    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuItem
    //             onClick={() => navigator.clipboard.writeText(payment.id)}
    //           >
    //             Copy payment ID
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem>View customer</DropdownMenuItem>
    //           <DropdownMenuItem>View payment details</DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];
};
