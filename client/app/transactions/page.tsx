"use client";

import { queries } from "@/api/queries";
import { TransactionColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import Loader from "@/components/loader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionType } from "@/types";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

//--------------------------------
const accounts = [
  { label: "USDC Mint Authority", value: "usdc_mint_auth" },
  { label: "Raydium Liquidity Pool", value: "raydium_lp" },
  { label: "Serum DEX", value: "serum_dex" },
];

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

  return (
    <div className="flex justify-start items-center flex-col gap-6 min-h-screen">
      <div className="w-full max-w-5xl px-4 flex flex-col gap-5">
        <h1 className="text-xl font-semibold">Transactions</h1>
        <Select>
          <SelectTrigger className="w-52">
            <SelectValue
              placeholder={
                <>
                  Filter by accounts <Filter className="h-2 w-2" />
                </>
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Accounts</SelectLabel>
              {accounts.map((account) => (
                <SelectItem key={account.value} value={account.value}>
                  {account.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DataTable data={transactions} columns={TransactionColumns} />
      </div>
    </div>
  );
};

export default Transactions;
