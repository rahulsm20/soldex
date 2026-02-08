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
  if (!(redisClient.status === "ready")) {
    await redisClient.connect();
  }
};

const disconnectRedis = async () => {
  if (redisClient.status === "ready") {
    redisClient.disconnect();
  }
};

export const cacheData = async (
  key: string,
  value: string,
  ttlSeconds?: number,
) => {
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
