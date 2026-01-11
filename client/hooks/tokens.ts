import { queries } from "@/api/queries";
import { TokenPriceResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useTokens = ({ tokens = [] }: { tokens: string[] }) => {
  return useQuery<TokenPriceResponse[]>(
    queries.FETCH_TOKEN_PRICES({ variables: { tokens } })
  );
};
