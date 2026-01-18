import { ExportResponse, TransactionsResponse } from "@/types";
import { DefinedInitialDataOptions } from "@tanstack/react-query";
import apiClient from ".";

export const queries = {
  FETCH_TRANSACTIONS: ({
    variables = {
      page: 1,
      pageSize: 50,
      address: "",
      startTime: "",
      endTime: "",
    },
  }: {
    variables: {
      page: number;
      pageSize: number;
      from_address?: string;
      address?: string;
      startTime?: string;
      endTime?: string;
    };
  }) =>
    ({
      queryKey: [
        "transactions",
        variables.page,
        variables.pageSize,
        variables.address,
        variables.startTime,
        variables.endTime,
      ] as const,
      initialData: {
        transactions: [],
        page: variables.page,
        pageSize: variables.pageSize,
        pageCount: 0,
      },
      queryFn: async (): Promise<TransactionsResponse> => {
        const response = await apiClient.fetchTransactions({ variables });
        return {
          transactions: response.transactions,
          page: response.page,
          pageSize: response.pageSize,
          pageCount: response.pageCount,
        };
      },
    }) satisfies DefinedInitialDataOptions<
      TransactionsResponse,
      Error,
      TransactionsResponse,
      readonly [
        "transactions",
        number,
        number,
        string | undefined,
        string | undefined,
        string | undefined,
      ]
    >,
  FETCH_TOKEN_PRICES: ({
    variables: { tokens },
  }: {
    variables: { tokens: string[] };
  }) => ({
    queryKey: ["token_prices", ...tokens] as const,
    queryFn: async () => {
      const response = await apiClient.fetchTokenPrices({
        variables: { tokens },
      });
      return response;
    },
  }),
  FETCH_CHART_DATA: () => ({
    queryKey: ["soldex_chart_data"] as const,
    queryFn: async () => {
      const response = await apiClient.fetchChartData();
      return response;
    },
  }),
  EXPORT_TRANSACTIONS: ({
    variables = {
      page: 1,
      pageSize: 50,
      address: "",
      startTime: "",
      endTime: "",
    },
    enabled = false,
  }: {
    variables: {
      page: number;
      pageSize: number;
      from_address?: string;
      address?: string;
      startTime?: string;
      endTime?: string;
    };
    enabled?: boolean;
  }) =>
    ({
      queryKey: [
        "export_transactions_pdf",
        variables.page,
        variables.pageSize,
        variables.address,
        variables.startTime,
        variables.endTime,
      ] as const,
      initialData: {
        filename: "",
        signedUrl: "",
      },
      queryFn: async (): Promise<ExportResponse> => {
        const { filename, signedUrl } = await apiClient.exportTransactionsPDF({
          variables,
        });
        return {
          filename,
          signedUrl,
        };
      },
      enabled,
    }) satisfies DefinedInitialDataOptions<
      ExportResponse,
      Error,
      ExportResponse,
      readonly [
        "export_transactions_pdf",
        number,
        number,
        string | undefined,
        string | undefined,
        string | undefined,
      ]
    >,
};
