import { NextFunction, Request, Response } from "express";
import ip from "ip";
import { cacheData, getCachedData } from "../redis";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   if (req.headers["x-internal-job"] == config.ENCRYPTION_KEY) {
  //     return next();
  //   }
  const address = ip.address();
  const encryptedAddress = Buffer.from(address).toString("base64");
  const cacheKey = `soldex_indexer:ip:${encryptedAddress}`;
  const data = await getCachedData(cacheKey);
  if (data) {
    if (parseInt(data) > 5) {
      return res.status(400).json("Rate limited");
    } else {
      const rate = parseInt(data) + 1;
      await cacheData(cacheKey, rate.toString(), 60);
    }
  } else {
    await cacheData(cacheKey, "0", 60);
  }
  next();
};
