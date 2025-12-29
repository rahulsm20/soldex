import { TransactionType } from "@/types";

class ApiClient {
  private readonly baseUrl: string;
  constructor() {
    this.baseUrl = process.env.SERVER_URL || "http://localhost:3002";
  }
  async fetchTransactions(): Promise<{ transactions: TransactionType[] }> {
    const response = await fetch(`${this.baseUrl}/transactions`);
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const data: { transactions: TransactionType[] } = await response.json();
    return data;
  }
}

const apiClient = new ApiClient();

export default apiClient;
