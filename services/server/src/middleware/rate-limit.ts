import { NextFunction, Request, Response } from "express";
import ip from "ip";
import { cacheData, getCachedData } from "shared/redis";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   if (req.headers["x-internal-job"] == config.ENCRYPTION_KEY) {
  //     return next();
  //   }
  const address = ip.address();
  const cacheKey = `soldex_server:ip:${address}`;
  const data = await getCachedData(cacheKey);
  if (data) {
    if (parseInt(data) > 5) {
      return res.status(400).json({
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
      });
    } else {
      const rate = parseInt(data) + 1;
      await cacheData(cacheKey, rate.toString(), 60);
    }
  } else {
    await cacheData(cacheKey, "0", 60);
  }
  next();
};
