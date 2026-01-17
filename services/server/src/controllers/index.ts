import { desc, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { db } from "shared/drizzle/db";
import { cacheData, getCachedData } from "shared/redis";
import { CACHE_KEYS } from "shared/utils/constants";
import { TransactionWhereInput } from "types";
import { solana_transactions } from "../../../shared/drizzle/schema";

export const transactionsController = {
  fetchTransactions: async (req: Request, res: Response) => {
    const {
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
    } = req.query;
    try {
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
        where.startTime = startTime;
      }
      if (endTime) {
        where.endTime = endTime;
      }
      const args = Object.values(where)
        .filter((val) => val !== undefined)
        .map((val) => val ?? "null");
      const cachedData = await getCachedData(CACHE_KEYS.TRANSACTIONS(...args));
      if (cachedData) {
        const data = JSON.parse(cachedData);
        return res.status(200).json(data);
      }

      const transactions = await db
        .select()
        .from(solana_transactions)
        .where(address ? eq(solana_transactions.address, address) : undefined)
        .limit(where.limit || 200)
        .offset(where.offset || 0)
        .orderBy(desc(solana_transactions.blockTime));

      const pageCount = await db
        .select()
        .from(solana_transactions)
        .where(address ? eq(solana_transactions.address, address) : undefined)
        .then((results) => {
          const total = results.length;
          const size = pageSize ? Number(pageSize) : 50;
          return Math.ceil(total / size);
        });

      const size = pageSize ? Number(pageSize) : 50;
      const result = {
        transactions,
        pageCount,
        pageSize: size,
        page: Number(page) || 1,
      };
      await cacheData(
        CACHE_KEYS.TRANSACTIONS(...args),
        JSON.stringify(result),
        100
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
