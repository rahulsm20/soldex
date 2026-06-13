import { queries } from "@/api/queries";
import { QueryClient, useQuery } from "@tanstack/react-query";

export const useFilters = ({ dateRange }: { dateRange: string[] }) => {
  const queryClient = new QueryClient();

  return useQuery(queries.FETCH_FILTERS({ dateRange }), queryClient);
};
