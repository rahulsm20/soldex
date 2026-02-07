import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { Request } from "express";
import { db } from "shared/drizzle/db";
import { cacheData, getCachedData } from "shared/redis";
import { ACCOUNTS, CACHE_KEYS } from "shared/utils/constants";
import {
  ChartDataResponse,
  TransactionsResponse,
  TransactionWhereInput,
} from "types";
import { solana_transactions } from "../../../shared/drizzle/schema";
// import { sql } from "bun";

export async function getTransactionsUtil({
  address,
  limit,
  page,
  pageSize,
  startTime,
  endTime,
}: {
  address?: string;
  limit?: number;
  page?: number;
  pageSize?: number;
  startTime?: string;
  endTime?: string;
}): Promise<TransactionsResponse> {
  let where: TransactionWhereInput = {};
  if (address) {
    where.address = address;
  }
  if (limit) {
    where.limit = limit;
  }
  if (page) {
    const size = pageSize ? Number(pageSize) : 50;
    where.limit = size;
    where.offset = (Number(page) - 1) * size;
  }
  if (startTime) {
    where.blockTime = { gte: startTime };
  }
  if (endTime) {
    where.blockTime = { ...where?.blockTime, lte: endTime };
  }
  const args = Object.values(where)
    .filter((val) => val !== undefined)
    .map((val) =>
      typeof val === "object" ? JSON.stringify(val) : (val ?? "null"),
    ) as (string | number)[];
  const cachedData = await getCachedData(CACHE_KEYS.TRANSACTIONS(...args));
  if (cachedData) {
    const data = JSON.parse(cachedData);
    return data;
  }

  const transactions = await db
    .select()
    .from(solana_transactions)
    .where(
      and(
        address ? eq(solana_transactions.address, address) : undefined,
        startTime
          ? gte(solana_transactions.blockTime, new Date(startTime))
          : undefined,
        endTime
          ? lte(solana_transactions.blockTime, new Date(endTime))
          : undefined,
      ),
    )
    .limit(where.limit || 200)
    .offset(where.offset || 0)
    .orderBy(desc(solana_transactions.blockTime));

  const pageCount = await db
    .select()
    .from(solana_transactions)
    .where(
      and(
        address ? eq(solana_transactions.address, address) : undefined,
        startTime
          ? gte(solana_transactions.blockTime, new Date(startTime))
          : undefined,
        endTime
          ? lte(solana_transactions.blockTime, new Date(endTime))
          : undefined,
      ),
    )
    .then((results) => {
      const total = results.length;
      const size = pageSize ? Number(pageSize) : 50;
      return Math.ceil(total / size);
    });

  const size = pageSize ? Number(pageSize) : 50;
  const result: TransactionsResponse = {
    transactions,
    pageCount,
    pageSize: size,
    page: Number(page) || 1,
  };
  await cacheData(
    CACHE_KEYS.TRANSACTIONS(...args),
    JSON.stringify(result),
    100,
  );
  return result;
}

export async function getTransactionsChartDataUtil(
  req: Request,
): Promise<ChartDataResponse[]> {
  const { address, startTime: startString, endTime: endString } = req.query;
  const startTime = startString ? String(startString) : undefined;
  const endTime = endString ? String(endString) : undefined;
  const conditions = [];
  const rawConditions = [];
  if (address) {
    conditions.push(eq(solana_transactions.address, String(address)));
    rawConditions.push(address);
  }

  if (startTime) {
    conditions.push(gte(solana_transactions.blockTime, new Date(startTime)));
    rawConditions.push(startTime);
  }

  if (endTime) {
    conditions.push(lte(solana_transactions.blockTime, new Date(endTime)));
    rawConditions.push(endTime);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const args = rawConditions
    .filter((val) => val !== undefined)
    .map((val) =>
      typeof val === "object" ? JSON.stringify(val) : (val ?? "null"),
    ) as (string | number)[];
  const cachedData = await getCachedData(CACHE_KEYS.CHART_DATA(...args));
  if (cachedData) {
    const data = JSON.parse(cachedData);
    return data;
  }
  const transactions: {
    address: string;
    blockTime: Date;
    tx_count: number;
  }[] = await db
    .select({
      address: solana_transactions.address,
      blockTime:
        sql`DATE_TRUNC('day', ${solana_transactions.blockTime})`.as<Date>(),
      tx_count: sql`COUNT(*)`.as<number>(),
    })
    .from(solana_transactions)
    .where(where)
    .groupBy(
      solana_transactions.address,
      sql`DATE_TRUNC('day', ${solana_transactions.blockTime})`,
    )
    .orderBy(
      sql`DATE_TRUNC('day', ${solana_transactions.blockTime}) DESC`,
      solana_transactions.address,
    );
  const result = transactions.map((tx) => ({
    address: tx.address,
    time: new Date(tx.blockTime),
    tx_count: Number(tx.tx_count),
  }));

  const mergedResult = result.reduce((acc: any[], curr) => {
    let existing = acc.find(
      (item) => item.time.getTime() === curr.time.getTime(),
    );
    if (existing) {
      existing[curr.address] = curr.tx_count;
    } else {
      acc.push({ time: curr.time, [curr.address]: curr.tx_count });
    }
    return acc;
  }, []);

  // for missing dates, fill with 0
  const dateSet = new Set(result.map((item) => item.time.getTime()));
  const startDate = new Date(
    Math.min(...result.map((item) => item.time.getTime())),
  );
  const endDate = new Date(
    Math.max(...result.map((item) => item.time.getTime())),
  );

  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    if (!dateSet.has(dt.getTime())) {
      const zeroEntry: any = { time: new Date(dt) };
      ACCOUNTS.forEach((tx) => {
        zeroEntry[tx.sig] = 0;
      });
      mergedResult.push(zeroEntry);
    } else {
      const existingEntry = mergedResult.find(
        (item) => item.time.getTime() === dt.getTime(),
      );
      if (existingEntry) {
        ACCOUNTS.forEach((tx) => {
          if (!(tx.sig in existingEntry)) {
            existingEntry[tx.sig] = 0;
          }
        });
      }
    }
  }
  mergedResult.sort((a, b) => a.time.getTime() - b.time.getTime());

  return mergedResult;
}
