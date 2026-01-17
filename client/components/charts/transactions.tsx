"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ACCOUNTS } from "@/lib/constants";
import { formatDateBasedOnBucket } from "@/lib/utils";
import { BucketSize, ChartDataType } from "@/types";
import Loader from "../loader";

//------------------------------------------------

const chartConfig = ACCOUNTS.reduce(
  (config, account) => ({
    ...config,
    [account.sig]: {
      label: account.label,
      color: `var(--chart-${ACCOUNTS.indexOf(account) + 1})`,
    },
  }),
  {}
) satisfies ChartConfig;

export function ChartAreaInteractive({
  data = [],
  labels = [],
  description,
  range,
  loading,
}: {
  data?: ChartDataType[];
  labels?: { label: string; value: string; sig: string; color: string }[];
  title?: string;
  description?: string;
  loading?: boolean;
  range?: BucketSize;
}) {
  return (
    <Card className="pt-0 bg-transparent w-1/3 md:w-2/3 lg:w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          {/* <CardTitle>{title || "Area Chart - Interactive"}</CardTitle> */}
          <CardDescription>
            {description || "Showing total visitors for the last 3 months"}
          </CardDescription>
        </div>
        {/* <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select> */}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 bg-none">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          {loading ? (
            <Loader />
          ) : (
            <AreaChart data={data}>
              <defs>
                {labels.map((label, index) => (
                  <linearGradient
                    key={label.value}
                    id={`${index + 1}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={label.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={label.color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid />
              <XAxis
                dataKey="time"
                // tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return formatDateBasedOnBucket(
                    Math.floor(date.getTime() / 1000),
                    range || "1d"
                  );
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(_value, payload) => {
                      const date = payload?.[0]?.payload?.time;

                      if (date) {
                        const dt = new Date(date);
                        return formatDateBasedOnBucket(
                          Math.floor(dt.getTime() / 1000),
                          range || "1d"
                        );
                      }
                      return "";
                    }}
                    indicator="dot"
                  />
                }
              />
              {labels.map((label) => (
                <Area
                  key={label.value}
                  dataKey={label.sig}
                  // type="natural"
                  fill={`url(#${labels.indexOf(label) + 1})`}
                  stroke={label.color}
                  // stackId="a"
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
