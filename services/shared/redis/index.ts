import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("disconnect", () => console.log("Disconnected from Redis"));
redisClient.on("error", function (error) {
  console.error(error);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
  }
};

export const cacheData = async (
  key: string,
  value: string,
  ttlSeconds?: number
) => {
  await connectRedis();
  if (ttlSeconds) {
    await redisClient.setEx(key, ttlSeconds, value);
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
