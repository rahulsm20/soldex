import Redis from "ioredis";
import { config } from "../config";

export const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("disconnect", () => console.log("Disconnected from Redis"));
redisClient.on("error", function (error) {
  console.error(error);
});

const connectRedis = async () => {
  // ioredis auto-connects, so we just need to wait for it to be ready
  if (redisClient.status === "ready") {
    return; // Already connected
  }

  if (redisClient.status === "connecting" || redisClient.status === "wait") {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Redis connection timeout"));
      }, 10000); // 10 second timeout

      redisClient.once("ready", () => {
        clearTimeout(timeout);
        resolve();
      });

      redisClient.once("error", (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  } else if (redisClient.status === "end" || redisClient.status === "close") {
    await redisClient.connect();
  }
};

const disconnectRedis = async () => {
  if (redisClient.status === "ready") {
    redisClient.disconnect();
  }
};

/**
 * Util function to cache data in Redis
 * @param key Key to identify data
 * @param value Value to be stored
 * @param ttlSeconds Time to Live
 */
export const cacheData = async (
  key: string,
  value: string,
  ttlSeconds?: number,
): Promise<void> => {
  await connectRedis();
  if (ttlSeconds) {
    await redisClient.setex(key, ttlSeconds, value);
  } else {
    await redisClient.set(key, value);
  }
};

export const getCachedData = async (key: string): Promise<string | null> => {
  await connectRedis();
  return await redisClient.get(key);
};

export const closeRedisConnection = async () => {
  await disconnectRedis();
};
