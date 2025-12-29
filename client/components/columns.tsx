import { TransactionType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import CopyToClipboard from "./copy-to-clipboard";
import { Button } from "./ui/button";

export const TransactionColumns: ColumnDef<TransactionType>[] = [
  {
    header: "Signature",
    accessorKey: "signature",
    cell: ({ row }) => (
      <div className="flex w-42 items-center justify-between">
        <Link
          href={`https://solscan.io/tx/${row.original.signature}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {row.original.signature.slice(0, 5)}...
          {row.original.signature.slice(-5)}
        </Link>
        <CopyToClipboard text={row.original.signature} />
      </div>
    ),
  },
  {
    header: "Slot",
    accessorKey: "slot",
  },
  {
    header: ({ column }) => {
      return (
        <div className="flex gap-1 items-center">
          <span>Block Time</span>
          <Button
            variant="ghost"
            title="Sort by block time"
            className="hover:bg-none bg-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    accessorKey: "blockTime",
    cell: ({ row }) => {
      if (row.original.blockTime === null) return <span>N/A</span>;
      const date = new Date(row.original.blockTime * 1000);
      return <span>{date.toLocaleString()}</span>;
    },
  },
  {
    header: "Updated At",
    accessorKey: "updated_at",
  },
  {
    header: "Created At",
    accessorKey: "created_at",
  },
];
