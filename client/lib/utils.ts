import { TransactionType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transactionDataToChartData(
  transactions: TransactionType[] = []
) {
  const data = new Map<string, { date: number; [key: string]: number }>();

  transactions.forEach((tx) => {
    if (!tx.blockTime) return;

    const date = new Date(tx.blockTime * 1000).toISOString().split("T")[0];
    const unixTime = new Date(date).getTime();

    if (data.has(date)) {
      const existing = data.get(date)!;
      existing[tx.address] = existing[tx.address]
        ? existing[tx.address] + 1
        : 1;
      data.set(date, existing);
    } else {
      data.set(date, {
        [tx.address]: 1,
        date: unixTime,
      });
    }
  });

  // fill missing address keys with 0
  const allAddresses = new Set(transactions.map((tx) => tx.address));

  data.forEach((entry) => {
    allAddresses.forEach((address) => {
      if (!(address in entry)) {
        entry[address] = 0;
      }
    });
  });
  return Array.from(data.values());
}
