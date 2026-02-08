export type TransactionWhereInput = {
  address?: string;
  limit?: number;
  offset?: number;
  blockTime?: {
    gte?: string;
    lte?: string;
  };
};

export type TokenPriceResponse = {
  id: string;
  address: string;
  name: string | null | undefined;
  symbol: string | null | undefined;
  icon: string | null | undefined;
  decimals: number | null | undefined;
  price: number | null;
  priceChange24h: number | null;
};

export type TransactionType = {
  id: string;
  address?: string;
  signature: string;
  slot: number;
  blockTime: Date | null;
  created_at: Date;
  updated_at: Date;
  from_address?: string | null;
  to_address?: string | null;
};

export type TransactionsResponse = {
  transactions: TransactionType[];
  page: number;
  pageSize: number;
  pageCount: number;
};

export type ChartDataResponse = {
  time: string;
  [tokenAddress: string]: number | string;
};

export type ChartPoint = {
  label: string;
  value: number;
};

export type ChartDataType = {
  [key: string]: number | string;
  time: string;
};

export type BucketSize = "1m" | "5m" | "1h" | "1d";

export type ExportResponse = {
  filename: string;
  signedUrl: string;
};

export type TimeRange =
  | "1h"
  | "6h"
  | "24h"
  | "1d"
  | "7d"
  | "30d"
  | "90d"
  | "180d"
  | "1y";
