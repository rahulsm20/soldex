"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Options } from "nuqs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex: number; // current page index
  pageCount: number; // total pages,
  pageSize: number; // items per page
  onPageChange: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined,
  ) => Promise<URLSearchParams>; // callback to parent
  filter?: { id: string; value: string } | string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  pageCount,
  pageSize: rowCount,
  onPageChange,
  filter,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Sync parent filter -> table filter
  useEffect(() => {
    if (filter) {
      setColumnFilters([
        {
          id: "address",
          value: filter,
        },
      ]);
    } else {
      setColumnFilters([]);
    }
  }, [filter]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    rowCount,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="overflow-hidden rounded-md w-full max-w-2/3 lg:max-w-full border">
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
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 w-full lg:w-screen text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 p-4">
        {pageCount > 0 && (
          <span>
            Page {pageIndex} / {pageCount}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange((old) => (old ? String(1) : null))}
          disabled={pageIndex === 1}
        >
          <ChevronFirst />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPageChange((old) => (old ? String(Number(old) - 1) : null))
          }
          disabled={pageIndex === 1}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPageChange((old) => (old ? String(Number(old) + 1) : null))
          }
          disabled={pageIndex + 1 > pageCount}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPageChange((old) => (old ? String(pageCount) : null))
          }
          disabled={pageIndex + 1 > pageCount}
        >
          <ChevronLast />
        </Button>
      </div>
    </div>
  );
}
