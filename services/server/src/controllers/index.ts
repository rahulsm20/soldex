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
    }: {
      address?: string;
      limit?: number;
    } = req.query;
    try {
      let where: TransactionWhereInput = {};
      if (address) {
        where.address = address;
      }
      if (limit) {
        where.limit = limit;
      }

      const cachedData = await getCachedData(
        CACHE_KEYS.TRANSACTIONS_FOR_ADDRESS
      );
      if (cachedData) {
        const transactions = JSON.parse(cachedData);
        return res.status(200).json({ transactions });
      }

      const transactions = await db
        .select()
        .from(solana_transactions)
        .where(address ? eq(solana_transactions.address, address) : undefined)
        .limit(where.limit || 200)
        .orderBy(desc(solana_transactions.blockTime));

      await cacheData(
        CACHE_KEYS.TRANSACTIONS_FOR_ADDRESS,
        JSON.stringify(transactions),
        100
      );
      return res.status(200).json({ transactions });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
