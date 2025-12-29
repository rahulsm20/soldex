import { TransactionsResponse } from "@/types";
import { DefinedInitialDataOptions } from "@tanstack/react-query";
import apiClient from ".";

export const queries = {
  FETCH_TRANSACTIONS: {
    queryKey: ["transactions"],
    initialData: {
      transactions: [],
    },
    queryFn: async (): Promise<TransactionsResponse> => {
      const response = await apiClient.fetchTransactions();
      return { transactions: response.transactions };
    },
  } satisfies DefinedInitialDataOptions<
    TransactionsResponse,
    Error,
    TransactionsResponse,
    readonly ["transactions"]
  >,
};
