import { generateLink } from "@/lib/utils";
import {
  ChartDataResponse,
  TokenPriceResponse,
  TransactionType,
} from "@soldex/types";

class ApiClient {
  private readonly baseUrl: string;
  private readonly headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-internal-job": process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "",
  };
  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3002";
  }

  async fetchTransactions({
    variables,
  }: {
    variables: {
      page?: number;
      pageSize?: number;
      address?: string;
      startTime?: string;
      endTime?: string;
    };
  }): Promise<{
    transactions: TransactionType[];
    page: number;
    pageSize: number;
    pageCount: number;
  }> {
    const url = generateLink(this.baseUrl, "/transactions", {
      page: variables.page,
      pageSize: variables.pageSize,
      address: variables.address,
      startTime: variables.startTime,
      endTime: variables.endTime,
    });
    const response = await fetch(url, {
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const data: {
      transactions: TransactionType[];
      page: number;
      pageSize: number;
      pageCount: number;
    } = await response.json();

    return data;
  }
  async fetchTokenPrices({
    variables,
  }: {
    variables: { tokens: string[] };
  }): Promise<TokenPriceResponse[]> {
    try {
      const url = `${this.baseUrl}/token`;
      // const idsParam = variables.tokens.join(",");
      const response = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({ tokens: variables.tokens }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch token prices");
      }
      return await response.json();
    } catch (error) {
      console.error(
        "Error fetching token prices: ",
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }
  async fetchChartData({
    variables,
  }: {
    variables: { startTime?: string; endTime?: string; address?: string };
  }): Promise<ChartDataResponse[]> {
    const url = generateLink(this.baseUrl, "/charts", {
      startTime: variables.startTime,
      endTime: variables.endTime,
      address: variables.address,
    });
    const response = await fetch(url, {
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch chart data");
    }
    const data = await response.json();
    return data;
  }
  async exportTransactionsPDF({
    variables,
  }: {
    variables: {
      page?: number;
      pageSize?: number;
      address?: string;
      startTime?: string;
      endTime?: string;
    };
  }): Promise<{
    filename: string;
    signedUrl: string;
  }> {
    const url = generateLink(this.baseUrl, "/file", {
      page: variables.page,
      pageSize: variables.pageSize,
      address: variables.address,
      startTime: variables.startTime,
      endTime: variables.endTime,
    });
    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error("Failed to export transactions PDF");
    }
    const data: {
      filename: string;
      signedUrl: string;
    } = await response.json();

    return data;
  }
}

const apiClient = new ApiClient();

export default apiClient;
