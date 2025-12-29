import { queries } from "@/api/queries";
import { TransactionType } from "@/types";
import { QueryClient, useQuery } from "@tanstack/react-query";

export const useTransactions = () => {
  const queryClient = new QueryClient();
  return useQuery<{ transactions: TransactionType[] }>(
    queries.FETCH_TRANSACTIONS,
    queryClient
  );
};
