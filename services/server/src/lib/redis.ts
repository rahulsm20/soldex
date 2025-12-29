import { RedisClient } from "bun";

/**
 * A simple Redis client wrapper for caching data.
 * Methods:
 * - connect: Establishes a connection to the Redis server.
 * - cacheData: Caches data with a specified key.
 * - getData: Retrieves cached data by key.
 */
class RedisClass {
  private client: RedisClient;
  constructor(url: string) {
    if (!url) {
      throw new Error("Redis URL must be provided");
    }
    this.client = new RedisClient(url);
    return this;
  }

  /**
   * Connect to the Redis server.
   * @return Promise<void>
   */
  async connect() {
    if (!this.client.connected) {
      await this.client.connect();
    }
  }

  /**
   * Caches data in Redis.
   * @param key
   * @param value
   * @return Promise<"OK" | null>
   */
  async cacheData(key: string, value: string) {
    await this.connect();
    return await this.client.set(key, value);
  }

  /**
   * Fetches cached data from Redis.
   * @param key
   * @returns Promise<string | null>
   */
  async getData(key: string): Promise<string | null> {
    await this.connect();
    return await this.client.get(key);
  }
}

export const redisClient = new RedisClass(process.env.REDIS_URL || "");
