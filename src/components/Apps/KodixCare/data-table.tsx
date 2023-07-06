import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { DataTablePagination } from "@/components/pagination";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Button } from "@ui/button";
import { Label } from "@/components/ui/label";
import { addDays, format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PencilIcon,
  Trash2,
} from "lucide-react";
import CancelationDialog from "./CancelationDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/components/ui/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment";
import EditEventDialog from "./EditEventDialog";

interface DataTableProps<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  data: TData[];
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  isLoading: boolean;
}

export function DataTable<TData>({
  columns,
  data,
  selectedDate,
  setSelectedDate,
  isLoading,
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  return (
    <div className="mt-8">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Label htmlFor="search">Search...</Label>
          <Input
            id="search"
            placeholder="Search by title..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="space-x-2 text-center">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedDate((prev) => prev && addDays(prev, -1));
            }}
            size={"sm"}
          >
            <ChevronLeft />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedDate((prev) => prev && addDays(prev, 1));
            }}
            size={"sm"}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="invisible space-y-2">
          <Label>Invisible cause Im bat at css...</Label>
          <Input className="max-w-sm" />
        </div>
      </div>

      <div className="mt-4 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <ContextMenu key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    key={row.id}
                  >
                    <EditEventDialog
                      open={openEditDialog}
                      setOpen={setOpenEditDialog}
                      eventId={row.getValue("eventId")}
                      date={row.getValue("date")}
                    />
                    <CancelationDialog
                      open={openCancelDialog}
                      setOpen={setOpenCancelDialog}
                      eventId={row.getValue("eventId")}
                      date={row.getValue("date")}
                    />
                    <ContextMenuTrigger className="contents">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, {
                            ...cell.getContext(),
                          })}
                        </TableCell>
                      ))}
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => setOpenEditDialog(true)}>
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Edit Event
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => setOpenCancelDialog(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Event
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </TableRow>
                </ContextMenu>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No events for this day
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
