import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex: number; // current page index
  pageCount: number; // total pages,
  pageSize: number; // items per page
  filter?: { id: string; value: string } | string;
}

export function LoadingTransactionsTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageSize: rowCount,
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
    <div className="w-full overflow-s rounded-md max-w-1/3 md:max-w-2/3 lg:max-w-full border">
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
          {Array.from({ length: 20 }).map((_, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={`${col.header}-${index}`}>
                  <Skeleton className="h-10 flex-1 w-full animate-pulse" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default LoadingTransactionsTable;
