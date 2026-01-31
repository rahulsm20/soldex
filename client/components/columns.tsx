import { generateSolscanLink } from "@/lib/utils";
import { TransactionType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import HoverPopover from "./hover-popover";
import TxLink from "./tx-link";
import { Button } from "./ui/button";
dayjs.extend(relativeTime);

//------------------------------------------------
export function TransactionColumns(
  page: number,
  pageSize: number,
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
        <div className="flex w-42 items-center justify-between underline">
          <TxLink
            title={
              <>
                {row.original.signature?.slice(0, 5)}...
                {row.original.signature?.slice(-5)}
              </>
            }
            text={row.original.signature}
            url={generateSolscanLink("tx", row.original.signature)}
          />
        </div>
      ),
      filterFn: "includesString",
      enableColumnFilter: true,
    },
    {
      header: "Mint Address",
      accessorKey: "address",
      cell: ({ row }) => (
        <div className="flex w-42 items-center justify-between underline">
          <TxLink
            title={
              <span>
                {row.original.address?.slice(0, 5)}...
                {row.original.address?.slice(-5)}
              </span>
            }
            text={row.original.address}
            url={generateSolscanLink("account", row.original.address)}
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
        const isSorted = column.getIsSorted();

        return (
          <div className="flex gap-1 items-center justify-between">
            <span>Block Time</span>
            <Button
              variant="ghost"
              title="Sort by block time"
              className="hover:bg-none bg-none flex items-center justify-center"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {isSorted === "asc" ? (
                <ArrowDown className=" h-4 w-full" />
              ) : isSorted === "desc" ? (
                <ArrowUp className=" h-4 w-full" />
              ) : (
                <ArrowUpDown className="h-4 w-full" />
              )}
            </Button>
          </div>
        );
      },
      accessorKey: "blockTime",
      cell: ({ row }) => {
        if (row.original.blockTime === null) return <span>N/A</span>;
        const date = new Date(row.original.blockTime);
        return (
          <HoverPopover
            content={
              <span>
                {dayjs(date).format("YYYY-MM-DD hh:mma")} (
                <span>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>)
              </span>
            }
          >
            <span>{dayjs(row.original.blockTime).fromNow()}</span>
          </HoverPopover>
        );
      },
    },
    {
      header: "From",
      accessorKey: "from_address",
      cell: ({ row }) => (
        <div className="flex w-42 items-center justify-between underline">
          {row.original.from_address ? (
            <>
              <TxLink
                title={
                  <span>
                    {row.original.from_address?.slice(0, 5)}...
                    {row.original.from_address?.slice(-5)}
                  </span>
                }
                text={row.original.from_address}
                url={generateSolscanLink("account", row.original.from_address)}
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
        <div className="flex w-42 items-center justify-between underline">
          {row.original.to_address ? (
            <>
              <TxLink
                title={
                  <span>
                    {row.original.to_address?.slice(0, 5)}...
                    {row.original.to_address?.slice(-5)}
                  </span>
                }
                text={row.original.to_address}
                url={generateSolscanLink("account", row.original.to_address)}
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
