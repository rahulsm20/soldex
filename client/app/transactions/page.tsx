"use client";

import { ChartAreaInteractive } from "@/components/charts/transactions";
import { TransactionColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import PageLayout from "@/components/page-layout";
import TransactionsPageSkeleton from "@/components/skeletons/TransactionsPage";
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
import { useChart } from "@/hooks/charts";
import { useExportTransactionsPDF } from "@/hooks/pdf";
import { useTransactions } from "@/hooks/transactions";
import { ACCOUNTS } from "@/lib/constants";
import { determineBucketSize, generateTimeRange } from "@/lib/utils";
import { TimeRange } from "@/types";
import { Download, Filter } from "lucide-react";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { toast } from "sonner";

//--------------------------------

const Transactions = ({}) => {
  const [pageSize, _setPageSize] = useQueryState("pageSize", {
    defaultValue: "20",
  });

  const [address, setAddress] = useQueryState("address", {
    defaultValue: "",
  });
  const [queryPage, setQueryPage] = useQueryState("page", {
    defaultValue: "1",
  });
  const [download, setDownload] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const { from, to } = useMemo(() => generateTimeRange(timeRange), [timeRange]);

  const { data, isLoading, error, isFetching } = useTransactions({
    page: queryPage ? parseInt(queryPage, 10) : 1,
    pageSize: pageSize ? parseInt(pageSize, 10) : 20,
    address,
    startTime: from,
    endTime: to,
  });
  const { isLoading: isExportLoading, isFetching: isExportFetching } =
    useExportTransactionsPDF(
      {
        page: queryPage ? parseInt(queryPage, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize, 10) : 20,
        address: address || undefined,
      },
      download,
      setDownload,
    );
  const isPDFDownloading = isExportLoading || isExportFetching;
  const { data: formattedChartData } = useChart({
    startTime: from,
    endTime: to,
    address,
  });
  const transactions = data?.transactions || [];
  const toUnix = transactions?.[0]?.blockTime;
  const fromUnix = transactions?.[transactions.length - 1]?.blockTime;

  const [showToast, setShowToast] = useState(true);
  const [open, setOpen] = useState(false);
  const [bucketSize, setBucketSize] = useState(
    determineBucketSize(fromUnix, toUnix),
  );

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

  // if (!isFetching && transactions.length == 0) {
  //   return (
  //     <PageLayout>
  //       <div className="flex justify-center items-center flex-col gap-6 min-h-screen">
  //         <h1 className="text-xl font-semibold">No Transactions Found</h1>
  //         <p className="text-center text-muted-foreground max-w-md">
  //           There are no transactions to display for the selected account.
  //           Please try selecting a different account or check back later.
  //         </p>
  //       </div>
  //     </PageLayout>
  //   );
  // }

  return (
    <PageLayout>
      {isLoading || isFetching ? (
        <TransactionsPageSkeleton />
      ) : (
        <div className="flex justify-start items-center flex-col gap-6 min-h-screen ">
          <div className="w-full max-w-5xl px-4 flex flex-col gap-5">
            <div className="flex flex-col justify-center items-center gap-5">
              <h1 className="text-xl font-semibold lg:w-full">Transactions</h1>
              <div className="flex gap-2 items-center justify-between lg:w-full">
                <Select
                  onValueChange={setAddress}
                  open={open}
                  value={address || ""}
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
                        <SelectItem key={account.sig} value={account.sig}>
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
                        setAddress("");
                        setOpen(false);
                      }}
                    >
                      Clear
                    </Button>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  disabled={isPDFDownloading}
                  onClick={() => {
                    setDownload(true);
                  }}
                >
                  <Download />
                  <span>
                    {isPDFDownloading ? "Downloading..." : "Download"}
                  </span>
                </Button>
              </div>
              <ChartAreaInteractive
                data={formattedChartData}
                labels={ACCOUNTS}
                bucket={bucketSize}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                setBucket={setBucketSize}
                title="Transactions"
                description="Showing number of transactions per day for the selected period."
              />
              <DataTable
                data={transactions}
                columns={TransactionColumns(
                  data?.page || 1,
                  data?.pageSize || 10,
                )}
                pageCount={data?.pageCount}
                pageIndex={data?.page}
                pageSize={data?.pageSize}
                onPageChange={setQueryPage}
                filter={address}
              />
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Transactions;
