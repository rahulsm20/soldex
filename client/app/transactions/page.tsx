"use client";

import { queries } from "@/api/queries";
import { ChartAreaInteractive } from "@/components/charts/transactions";
import { TransactionColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACCOUNTS } from "@/lib/constants";
import { transactionDataToChartData } from "@/lib/utils";
import { TransactionType } from "@/types";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { Download, Filter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

//--------------------------------

const Transactions = () => {
  const queryClient = new QueryClient();
  const {
    data = { transactions: [] },
    isLoading,
    error,
    isFetching,
  } = useQuery<{ transactions: TransactionType[] }>(
    queries.FETCH_TRANSACTIONS,
    queryClient
  );

  const [showToast, setShowToast] = useState(true);

  if (isLoading || isFetching) return <Loader />;
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
  const chartData = transactionDataToChartData(transactions).sort(
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
    <div className="flex justify-start items-center flex-col gap-6 min-h-screen">
      <div className="w-full max-w-5xl px-4 flex flex-col gap-5">
        <h1 className="text-xl font-semibold">Transactions</h1>
        <div className="flex gap-2 items-center justify-between">
          <Select>
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
                    {account.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" disabled>
            <Download /> <span>Download</span>
          </Button>
        </div>
        <ChartAreaInteractive
          data={chartData}
          labels={ACCOUNTS}
          title="Transactions"
          description="Showing transactions per day for the selected period."
        />
        <DataTable data={transactions} columns={TransactionColumns} />
      </div>
    </div>
  );
};

export default Transactions;
