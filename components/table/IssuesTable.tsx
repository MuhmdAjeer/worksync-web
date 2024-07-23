import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ScrollArea } from "../ui/scroll-area";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  fetch: (element: HTMLDivElement) => void;
}

export function IssueTable<TData, TValue>({
  columns,
  data,
  fetch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 35, // Adjust this value based on the expected row height
    getScrollElement: () => tableContainerRef.current,
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - virtualRows[virtualRows.length - 1].end
      : 0;

  return (
    <ScrollArea>
      <div
        onScroll={(e) => fetch(e.target as HTMLDivElement)}
        style={{
          overflow: "scroll",
          position: "relative",
          height: "860px", // Set a fixed height for the scrollable container
        }}
        ref={tableContainerRef}
        className="bg-card rounded-lg"
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {paddingTop > 0 && (
              <TableRow style={{ height: `${paddingTop}px` }}></TableRow>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "text-primary/70 border-r first:border-r-0 last:border-r-0 border-b border-secondary cursor-pointer p-0"
                      )}
                    >
                      <div className="min-h-full h-8 flex items-center px-2 border border-transparent hover:border hover:border-primary/50 hover:rounded">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {paddingBottom > 0 && (
              <TableRow style={{ height: `${paddingBottom}px` }}></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}
