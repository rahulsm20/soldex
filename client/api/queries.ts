import { TransactionsResponse } from "@/types";
import { DefinedInitialDataOptions } from "@tanstack/react-query";
import apiClient from ".";

export const queries = {
  FETCH_TRANSACTIONS: ({
    variables,
  }: {
    variables: { page: number; pageSize: number };
  }) =>
    ({
      queryKey: ["transactions", variables.page, variables.pageSize],
      initialData: {
        transactions: [],
      },
      queryFn: async (): Promise<TransactionsResponse> => {
        const response = await apiClient.fetchTransactions({ variables });
        return { transactions: response.transactions };
      },
    } satisfies DefinedInitialDataOptions<
      TransactionsResponse,
      Error,
      TransactionsResponse,
      readonly ["transactions", number, number]
    >),
};
