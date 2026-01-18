import { queries } from "@/api/queries";
import { ChartDataResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useChart = ({
  startTime,
  endTime,
  address,
}: {
  startTime?: string;
  endTime?: string;
  address?: string;
}) => {
  return useQuery<ChartDataResponse[]>(
    queries.FETCH_CHART_DATA({ startTime, endTime, address }),
  );
};
