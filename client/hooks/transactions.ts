import { queries } from "@/api/queries";
import { TransactionType } from "@/types";
import { QueryClient, useQuery } from "@tanstack/react-query";

export const useTransactions = ({
  // from_address,
  address,
  page,
  pageSize = 20,
}: {
  address?: string;
  // from_address?: string;
  page: number;
  pageSize?: number;
}) => {
  const queryClient = new QueryClient();
  const args: { page: number; pageSize: number; address?: string } = {
    page,
    pageSize,
  };
  if (address) {
    args.address = address;
  }
  if (page) {
    args.page = page;
  }
  if (pageSize) {
    args.pageSize = pageSize;
  }
  return useQuery<{
    transactions: TransactionType[];
    page: number;
    pageSize: number;
    pageCount: number;
  }>(queries.FETCH_TRANSACTIONS({ variables: args }), queryClient);
};
