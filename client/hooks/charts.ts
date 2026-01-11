import { queries } from "@/api/queries";
import { ChartDataResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useChart = () => {
  return useQuery<ChartDataResponse[]>(queries.FETCH_CHART_DATA());
};
