import { TransactionType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import CopyToClipboard from "./copy-to-clipboard";
import { Button } from "./ui/button";

export function TransactionColumns(
  page: number,
  pageSize: number
): ColumnDef<TransactionType>[] {
  return [
    {
      header: "#",
      accessorKey: "id",
      cell: ({ row }) => <span>{row.index + 1 + (page - 1) * pageSize}</span>,
    },
    {
      header: "Signature",
      accessorKey: "signature",
      cell: ({ row }) => (
        <div className="flex w-42 items-center justify-between">
          <Link
            href={`https://solscan.io/tx/${row.original.signature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {row.original.signature.slice(0, 5)}...
            {row.original.signature.slice(-5)}
          </Link>
          <CopyToClipboard
            title={"Copy signature to clipboard"}
            text={row.original.signature}
          />
        </div>
      ),
    },
    {
      header: "Address",
      accessorKey: "address",
      cell: ({ row }) => (
        <div className="flex w-42 items-center justify-between">
          <Link
            href={`https://solscan.io/account/${row.original.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {row.original.address.slice(0, 5)}...
            {row.original.address.slice(-5)}
          </Link>
          <CopyToClipboard
            title={"Copy address to clipboard"}
            text={row.original.address}
          />
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
          <div className="flex gap-1 items-center justify-between">
            <span>Block Time</span>
            <Button
              variant="ghost"
              title="Sort by block time"
              className="hover:bg-none bg-none flex items-center justify-center p-0"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
      header: "From",
      accessorKey: "from_address",
      cell: ({ row }) => (
        <div className="flex w-42 items-center justify-between">
          {row.original.from_address ? (
            <>
              <Link
                href={`https://solscan.io/account/${row.original.from_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {row.original.from_address.slice(0, 5)}...
                {row.original.from_address.slice(-5)}
              </Link>
              <CopyToClipboard
                title={"Copy address to clipboard"}
                text={row.original.from_address}
              />
            </>
          ) : (
            <span>N/A</span>
          )}
        </div>
      ),
    },
    {
      header: "To",
      accessorKey: "to_address",
      cell: ({ row }) => (
        <div className="flex w-42 items-center justify-between">
          {row.original.to_address ? (
            <>
              <Link
                href={`https://solscan.io/account/${row.original.to_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {row.original.to_address?.slice(0, 5)}...
                {row.original.to_address?.slice(-5)}
              </Link>
              <CopyToClipboard
                title={"Copy address to clipboard"}
                text={row.original.to_address}
              />
            </>
          ) : (
            <span>N/A</span>
          )}
        </div>
      ),
    },
  ];
}
