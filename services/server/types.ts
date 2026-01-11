export type TransactionWhereInput = {
  address?: string;
  limit?: number;
  offset?: number;
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
