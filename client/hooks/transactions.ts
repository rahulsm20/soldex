import { queries } from "@/api/queries";
import { TransactionType } from "@/types";
import { QueryClient, useQuery } from "@tanstack/react-query";

export const useTransactions = ({
  // from_address,
  // address,
  page,
  pageSize = 20,
}: {
  // address?: string;
  // from_address?: string;
  page: number;
  pageSize?: number;
}) => {
  const queryClient = new QueryClient();
  return useQuery<{
    transactions: TransactionType[];
    page: number;
    pageSize: number;
    pageCount: number;
  }>(
    queries.FETCH_TRANSACTIONS({ variables: { page, pageSize } }),
    queryClient
  );
};
