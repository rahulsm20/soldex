import { TokenPriceResponse, TransactionType } from "@/types";

class ApiClient {
  private readonly baseUrl: string;
  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3002";
  }
  async fetchTransactions({
    variables,
  }: {
    variables: { page?: number; pageSize?: number };
  }): Promise<{
    transactions: TransactionType[];
    page: number;
    pageSize: number;
    pageCount: number;
  }> {
    const response = await fetch(
      `${this.baseUrl}/transactions?page=${variables.page ?? 1}&pageSize=${
        variables.pageSize ?? 10
      }`
    );
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokens: variables.tokens }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch token prices");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching token prices: ", error);
      throw error;
    }
  }
}

const apiClient = new ApiClient();

export default apiClient;
