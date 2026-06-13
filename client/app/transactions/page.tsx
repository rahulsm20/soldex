"use client";

import { ChartAreaInteractive } from "@/components/charts/transactions";
import { TransactionColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import DownloadButton from "@/components/download";
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
import { useChart, useTimeRange } from "@/hooks/charts";
import { useExportTransactionsPDF } from "@/hooks/pdf";
import { useTransactions } from "@/hooks/transactions";
import { useFilters } from "@/hooks/useFilters";
import {
  determineBucketSize,
  generateTimeRange,
  getRandomColor,
} from "@/lib/utils";
import { FilterTransformedType, FilterType } from "@soldex/types";
import dayjs from "dayjs";
import { Filter } from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { toast } from "sonner";
//--------------------------------

const Transactions = ({ }) => {
  const [pageSize] = useQueryState("pageSize", {
    defaultValue: "20",
  });

  const [address, setAddress] = useQueryState("address", {
    defaultValue: "",
  });
  const [queryPage, setQueryPage] = useQueryState("page", {
    defaultValue: "1",
  });
  const { timeRange, setTimeRange } = useTimeRange();
  const { from, to } = useMemo(() => generateTimeRange(timeRange), [timeRange]);
  //const { data: filters } = useFilters({ dateRange: [from, to] });
  const { data, isLoading, error, isFetching } = useTransactions({
    page: queryPage ? parseInt(queryPage, 10) : 1,
    pageSize: pageSize ? parseInt(pageSize, 10) : 20,
    address,
    startTime: from,
    endTime: to,
  });
  const {
    isLoading: isExportLoading,
    isFetching: isExportFetching,
    downloadPDF,
  } = useExportTransactionsPDF({
    page: queryPage ? parseInt(queryPage, 10) : 1,
    pageSize: pageSize ? parseInt(pageSize, 10) : 20,
    address: address || undefined,
    startTime: from,
    endTime: to,
  });
  const isPDFDownloading = isExportLoading || isExportFetching;
  const { data: formattedChartData } = useChart({
    startTime: from,
    endTime: to,
    address,
  });
  const transactions = data?.transactions || [];
  const toUnix = dayjs(to).toDate().valueOf();
  const fromUnix = dayjs(from).toDate().valueOf();
  const filters = useMemo(() => data?.filters || [], [data?.filters]);
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
  const labels = useMemo(() => {
    const rawLabels = (filters || []).map((account: FilterType) => ({
      label: account.name,
      value: account.id,
      sig: account.id,
      color: getRandomColor(),
    }));
    const withOthers = (filters || []).reduce((acc: FilterTransformedType[], curr: FilterType) => {
      if (acc.length < 10) {
        acc.push({
          label: curr.name,
          value: curr.id,
          sig: curr.id,
          color: getRandomColor(),
        })
      }
      else {
        const others = acc.find(item => item.label === 'Others')
        if (!others) {
          acc.push({
            label: 'Others',
            value: 'others',
            sig: 'others',
            color: getRandomColor(),
          })
        }
      }
      return acc
    }, [])
    return withOthers
  }, [filters]);

  return (
    <PageLayout>
      {isLoading || isFetching ? (
        <TransactionsPageSkeleton />
      ) : (
        <div className="flex justify-start items-center flex-col gap-6 min-h-screen ">
          <div className="w-full max-w-5xl px-4 flex flex-col gap-5">
            <div className="flex flex-col justify-center items-center gap-5">
              <h1 className="text-xl font-semibold lg:w-full ">Transactions</h1>
              <div className="flex gap-2 items-center justify-between lg:w-full">
                <Select
                  onValueChange={setAddress}
                  open={open}
                  value={address || ""}
                  onOpenChange={setOpen}
                >
                  <SelectTrigger
                    className="w-52"
                    disabled={isLoading || isFetching}
                  >
                    <SelectValue
                      placeholder={
                        <div className="flex items-center gap-2">
                          <span> Filter by Mint </span>
                          <Filter className="h-2 w-2" />
                        </div>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Accounts</SelectLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {filters &&
                          filters.map((account: FilterType) => (
                            <SelectItem
                              key={account.id}
                              value={account.id}
                              title={account.name}
                            >
                              <div className="flex items-center gap-2 w-full justify-between">
                                <span>{account.symbol}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </div>
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
                <DownloadButton
                  loading={isPDFDownloading}
                  disabled={isPDFDownloading}
                  onClick={() => {
                    downloadPDF();
                  }}
                  loadingTitle="Downloading..."
                  buttonVariant="outline"
                />
              </div>
              <ChartAreaInteractive
                data={formattedChartData}
                labels={labels}
                bucket={bucketSize}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                setBucket={setBucketSize}
                filteredAccount={address ? address : undefined}
                title="Mint Transactions"
                description="Showing number of mint transactions per day for the selected period."
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
