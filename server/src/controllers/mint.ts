import { getTokenData } from "@/lib/jupiter";
import { Request, Response } from "express";
import { db } from "shared/drizzle/db";
import { solana_transactions } from "shared/drizzle/schema";
import { cacheData, getCachedData } from "shared/redis";

export const getFiltersHelper = async () => {
  const cacheKey = "soldex:filters";
  const cachedData = await getCachedData(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const addresses = await db
    .selectDistinct({ address: solana_transactions.address })
    .from(solana_transactions);
  const queries = addresses
    .map(({ address }) => address)
    .filter((a) => a != undefined);
  const data = await getTokenData(queries);
  await cacheData(cacheKey, JSON.stringify(data), 60 * 60 * 24);
  return data;
};

export const getFiltersInfo = async (_req: Request, res: Response) => {
  try {
    const data = await getFiltersHelper();
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error getting filters" });
  }
};
