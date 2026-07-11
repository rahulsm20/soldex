import { getTokenData } from "@/lib/jupiter";
import dayjs from "dayjs";
import { and, gte, lte } from "drizzle-orm";
import { Request, Response } from "express";
import { db } from "shared/drizzle/db";
import { solana_transactions } from "shared/drizzle/schema";
import { cacheData, getCachedData } from "shared/redis";

export const getFiltersHelper = async ({
  startTime,
  endTime,
}: {
  startTime: Date | string;
  endTime: Date | string;
}) => {
  const cacheKey = "soldex:filters";
  const cachedData = await getCachedData(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const addresses = await db
    .selectDistinct({ address: solana_transactions.address })
    .from(solana_transactions)
    .where(
      and(
        gte(
          solana_transactions.blockTime,
          startTime instanceof Date ? startTime : dayjs(startTime).toDate(),
        ),
        lte(
          solana_transactions.blockTime,
          endTime instanceof Date ? endTime : dayjs(endTime).toDate(),
        ),
      ),
    );

  const queries = addresses
    .map(({ address }) => address)
    .filter((a) => a != undefined);

  const data = await getTokenData(queries);
  const mappedData = (data ?? []).map(
    ({ id, name, symbol, icon, decimals }) => ({
      id,
      name,
      symbol,
      icon,
      decimals,
    }),
  );
  await cacheData(cacheKey, JSON.stringify(mappedData), 60 * 60 * 24);
  return mappedData;
};

export const getFiltersInfo = async (req: Request, res: Response) => {
  try {
    let { startTime: rawStartTime, endTime: rawEndTime } = req.query;
    let startTime = dayjs(rawStartTime as string).toDate();
    let endTime = dayjs(rawEndTime as string)
      .endOf("day")
      .toDate();
    if (!startTime) {
      startTime = dayjs().subtract(7, "day").startOf("day").toDate();
    }
    if (!endTime) {
      endTime = dayjs().endOf("day").toDate();
    }
    const data = await getFiltersHelper({ startTime, endTime });
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error getting filters" });
  }
};
