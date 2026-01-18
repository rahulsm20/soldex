export type TransactionWhereInput = {
  address?: string;
  limit?: number;
  offset?: number;
  startTime?: string;
  endTime?: string;
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
