import { BucketSize, TimeRange, TransactionType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transactionDataToChartData(
  transactions: TransactionType[],
  bucket: BucketSize,
) {
  const data = new Map<number, { date: number; [key: string]: number }>();
  const allAddresses = new Set<string>();

  transactions.forEach((tx) => {
    if (!tx.blockTime) return;

    allAddresses.add(tx.address);

    const bucketTime = bucketTimestamp(tx.blockTime, bucket);

    if (!data.has(bucketTime)) {
      data.set(bucketTime, { date: bucketTime });
    }

    const entry = data.get(bucketTime)!;
    entry[tx.address] = (entry[tx.address] ?? 0) + 1;
  });

  // fill missing addresses
  data.forEach((entry) => {
    allAddresses.forEach((addr) => {
      entry[addr] ??= 0;
    });
  });

  return Array.from(data.values()).sort((a, b) => a.date - b.date);
}

export function determineBucketSize(
  fromUnix?: number | null,
  toUnix?: number | null,
): BucketSize {
  if (!fromUnix || !toUnix) return "1d";
  const diffSeconds = toUnix - fromUnix;
  if (diffSeconds <= 60 * 60) return "1m"; // <= 1h
  if (diffSeconds <= 6 * 60 * 60) return "5m"; // <= 6h
  if (diffSeconds <= 24 * 60 * 60) return "1h"; // <= 1d
  return "1d";
}

export function bucketTimestamp(
  unixSeconds: number,
  bucket: BucketSize,
): number {
  const ms = unixSeconds * 1000;

  switch (bucket) {
    case "1m":
      return Math.floor(ms / (60 * 1000)) * (60 * 1000);
    case "5m":
      return Math.floor(ms / (5 * 60 * 1000)) * (5 * 60 * 1000);
    case "1h":
      return Math.floor(ms / (60 * 60 * 1000)) * (60 * 60 * 1000);
    case "1d":
      return Math.floor(ms / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
  }
}

export function formatDateBasedOnBucket(
  unixSeconds: number,
  bucket: BucketSize,
): string {
  const date = new Date(unixSeconds * 1000);

  switch (bucket) {
    case "1m":
    case "5m":
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "1h":
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      });
    case "1d":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    default:
      return date.toLocaleString();
  }
}

export function generateSolscanLink(
  type: "tx" | "account",
  identifier: string,
): string {
  if (type === "tx") {
    return `https://solscan.io/tx/${identifier}`;
  } else if (type === "account") {
    return `https://solscan.io/account/${identifier}`;
  }
  return "";
}

export function generateLink(
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | undefined>,
) {
  const url = new URL(path, baseUrl);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
}

export function generateTimeRange(range: TimeRange): {
  from: string;
  to: string;
} {
  const now = dayjs();
  let from = now;
  const to = now.endOf("day");

  switch (range) {
    case "1h":
      from = now.subtract(1, "hour");
      break;
    case "6h":
      from = now.subtract(6, "hour");
      break;
    case "24h":
      from = now.subtract(24, "hour").startOf("day");
      break;
    case "7d":
      from = now.subtract(7, "day").startOf("day");
      break;
    case "30d":
      from = dayjs(now).subtract(30, "day").startOf("day");
      break;
    case "90d":
      from = dayjs(now).subtract(90, "day").startOf("day");
      break;
    case "180d":
      from = dayjs(now).subtract(180, "day").startOf("day");
      break;
    case "1y":
      from = dayjs(now).subtract(1, "year").startOf("day");
      break;
    default:
      from = dayjs(now).subtract(7, "day").startOf("day");
      break;
  }

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}
