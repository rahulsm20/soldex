export type TransactionWhereInput = {
  address?: string;
  limit?: number;
  offset?: number;
};

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
