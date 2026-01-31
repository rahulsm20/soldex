import { queries } from "@/api/queries";
import { ChartDataResponse, TimeRange } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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

export const useTimeRange = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>(() => {
    try {
      if (typeof window == "undefined") return "7d" as TimeRange;
      const storedTimeRange = localStorage.getItem("timeRange") as TimeRange;
      return storedTimeRange || "7d";
    } catch (e) {
      console.error("Error accessing localStorage:", e);
      return "7d" as TimeRange;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("timeRange", timeRange);
    }
  }, [timeRange]);

  return { timeRange, setTimeRange };
};
