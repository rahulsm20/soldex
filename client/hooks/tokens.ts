import { queries } from "@/api/queries";
import { TokenPriceResponse } from "@/types";
import { QueryClient, useQuery } from "@tanstack/react-query";

export const useTokens = ({ tokens = [] }: { tokens: string[] }) => {
  const queryClient = new QueryClient();
  return useQuery<TokenPriceResponse[]>(
    queries.FETCH_TOKEN_PRICES({ variables: { tokens } }),
    queryClient
  );
};
