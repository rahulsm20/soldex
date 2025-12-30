export type TransactionType = {
  id: string;
  address: string;
  signature: string;
  slot: number;
  blockTime: number | null;
  created_at: string;
  updated_at: string;
};

export type TransactionsResponse = {
  transactions: TransactionType[];
};

export type ChartDataType = {
  [key: string]: number | string;
  date: number;
};
