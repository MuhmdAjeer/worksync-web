import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { IssueDto } from "@/generated/dto/issue-dto";
import IssueStateIcon from "../icons/IssueStateIcon";
import { RStack } from "../common/Stack";
import { priorities } from "../issues/IssuePriorityDropdown";
import { Calendar } from "../ui/calendar";
import DatePicker from "../ui/datePicker";
import { Button } from "../ui/button";
import { UpdateIssueDto } from "@/generated/dto/update-issue-dto";
import { IUpdateIssue } from "@/hooks/issue";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

type TArgs = {
  onUpdate?: (data: Omit<IUpdateIssue, "projectId">) => void;
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
      accessorKey: "title",
      header: ({ table }) => (
        <div className="flex items-center gap-6">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          <h1>Issues</h1>
        </div>
      ),
      cell({ row }) {
        return (
          <div className="flex items-center gap-6 group">
            <Checkbox
              className={`${
                row.getIsSelected() ? "visible" : "invisible"
              } group-hover:visible`}
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
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
          <RStack>
            {state && (
              <IssueStateIcon height="18px" width="18px" group={state.group} />
            )}
            <h1>{state?.name}</h1>
          </RStack>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.original.priority?.toString();
        if (!priority) return;
        const Priority = priorities.find((p) => p.name === priority);
        return (
          <RStack>
            {Priority?.Icon}
            <h1>{priority}</h1>
          </RStack>
        );
      },
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row: { original } }) => {
        // if (!original.start_date) return;
        return (
          <div className="w-full" >
            <DatePicker
              variant="ghost"
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
          </div>
        );
      },
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ row: { original } }) => {
        if (!original.end_date) return;
        return (
          <div>
            <h1>{format(original.end_date, "PPP")}</h1>
          </div>
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
