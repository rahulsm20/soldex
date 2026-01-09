export type TransactionType = {
  id: string;
  address: string;
  signature: string;
  slot: number;
  blockTime: number | null;
  created_at: string;
  updated_at: string;
  from_address: string;
  to_address: string;
};

export type TransactionsResponse = {
  transactions: TransactionType[];
  page: number;
  pageSize: number;
  pageCount: number;
};

export type ChartDataType = {
  [key: string]: number | string;
  date: number;
};

export type BucketSize = "1m" | "5m" | "1h" | "1d";
