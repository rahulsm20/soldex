import { sql } from "drizzle-orm";
import { Request, Response } from "express";
import { db } from "shared/drizzle/db";
import { solana_transactions } from "shared/drizzle/schema";
import { getCachedData } from "shared/redis";
import { ACCOUNTS, CACHE_KEYS } from "shared/utils/constants";

export const ChartsController = {
  getTransactionChartData: async (req: Request, res: Response) => {
    try {
      const { address, timeRange } = req.query;
      const cachedData = await getCachedData(CACHE_KEYS.CHART_DATA);
      if (cachedData) {
        const data = JSON.parse(cachedData);
        return res.status(200).json(data);
      }
      const transactions: { address: string; time: Date; tx_count: number }[] =
        await db
          .select({
            address: solana_transactions.address,
            time: sql`DATE_TRUNC('day', ${solana_transactions.blockTime})`.as<Date>(),
            tx_count: sql`COUNT(*)`.as<number>(),
          })
          .from(solana_transactions)
          .groupBy(
            solana_transactions.address,
            sql`DATE_TRUNC('day', ${solana_transactions.blockTime})`
          )
          .orderBy(
            sql`DATE_TRUNC('day', ${solana_transactions.blockTime}) DESC`,
            solana_transactions.address
          );
      const result = transactions.map((tx) => ({
        address: tx.address,
        time: tx.time,
        tx_count: Number(tx.tx_count),
      }));

      const mergedResult = result.reduce((acc: any[], curr) => {
        let existing = acc.find(
          (item) => item.time.getTime() === curr.time.getTime()
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
        Math.min(...result.map((item) => item.time.getTime()))
      );
      const endDate = new Date(
        Math.max(...result.map((item) => item.time.getTime()))
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
            (item) => item.time.getTime() === dt.getTime()
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

      return res.status(200).json(mergedResult);
    } catch (error) {
      console.log("Error in getTransactionChartData:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },
};
