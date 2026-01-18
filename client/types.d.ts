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
  time: string;
};

export type BucketSize = "1m" | "5m" | "1h" | "1d";

export type TokenPriceResponse = {
  id: string;
  address: string;
  name: string | null;
  symbol: string | null;
  icon: string | null;
  decimals: number | null;
  price: number | null;
  priceChange24h: number | null;
};

export type ChartDataResponse = {
  time: string;
  [tokenAddress: string]: number | string;
};

export type ExportResponse = {
  filename: string;
  signedUrl: string;
};
