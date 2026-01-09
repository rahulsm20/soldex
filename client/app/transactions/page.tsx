"use client";

import { ChartAreaInteractive } from "@/components/charts/transactions";
import { TransactionColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import Loader from "@/components/loader";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactions } from "@/hooks/transactions";
import { ACCOUNTS } from "@/lib/constants";
import { determineBucketSize, transactionDataToChartData } from "@/lib/utils";
import { Download, Filter } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

//--------------------------------

const Transactions = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isFetching } = useTransactions({ page });

  const [showToast, setShowToast] = useState(true);
  const [value, setValue] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  if (error) {
    if (showToast)
      toast("Error loading transactions", {
        description: error instanceof Error ? error.message : String(error),
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
            setShowToast(false);
          },
        },
      });
  }

  const transactions = data?.transactions || [];
  if (!isFetching && transactions.length == 0) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center flex-col gap-6 min-h-screen">
          <h1 className="text-xl font-semibold">No Transactions Found</h1>
          <p className="text-center text-muted-foreground max-w-md">
            There are no transactions to display for the selected account.
            Please try selecting a different account or check back later.
          </p>
        </div>
      </PageLayout>
    );
  }
  const toUnix = transactions?.[0]?.blockTime;
  const fromUnix = transactions?.[transactions.length - 1]?.blockTime;
  const timeRange = determineBucketSize(fromUnix, toUnix);
  const chartData = transactionDataToChartData(transactions, timeRange).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  {
    /* <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */
  }
  return (
    <PageLayout>
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <div className="flex justify-start items-center flex-col gap-6 min-h-screen">
          <div className="w-full max-w-5xl px-4 flex flex-col gap-5">
            <div className="flex flex-col justify-center items-center gap-10">
              <h1 className="text-xl font-semibold lg:w-full">Transactions</h1>
              <div className="flex gap-2 items-center justify-between lg:w-full">
                <Select
                  onValueChange={setValue}
                  open={open}
                  value={value || ""}
                  onOpenChange={setOpen}
                >
                  <SelectTrigger className="w-52">
                    <SelectValue
                      placeholder={
                        <div className="flex items-center gap-2">
                          <span>Filter by accounts</span>
                          <Filter className="h-2 w-2" />
                        </div>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Accounts</SelectLabel>
                      {ACCOUNTS.map((account) => (
                        <SelectItem key={account.value} value={account.value}>
                          <div className="flex items-center gap-2 w-full justify-between">
                            <span>{account.label}</span>
                            <Image
                              src={account.icon}
                              alt={account.label}
                              width={20}
                              height={20}
                            />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <Button
                      className="w-full px-2"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue(undefined);
                        setOpen(false);
                      }}
                    >
                      Clear
                    </Button>
                  </SelectContent>
                </Select>
                <Button variant="outline" disabled>
                  <Download /> <span>Download</span>
                </Button>
              </div>
              <ChartAreaInteractive
                data={chartData}
                labels={ACCOUNTS}
                range={timeRange}
                title="Transactions"
                description="Showing transactions per day for the selected period."
              />
              <DataTable
                data={transactions}
                columns={TransactionColumns(
                  data?.page || 1,
                  data?.pageSize || 10
                )}
                pageCount={data?.pageCount}
                pageIndex={data?.page}
                pageSize={data?.pageSize}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Transactions;
