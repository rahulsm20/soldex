import { TransactionType } from "@/types";

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
  }): Promise<{ transactions: TransactionType[] }> {
    const response = await fetch(
      `${this.baseUrl}/transactions?page=${variables.page ?? 1}&pageSize=${
        variables.pageSize ?? 10
      }`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const data: { transactions: TransactionType[] } = await response.json();
    return data;
  }
}

const apiClient = new ApiClient();

export default apiClient;
