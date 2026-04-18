import dotenv from "dotenv";
dotenv.config();

export const config = {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  elastic: process.env.ELASTIC || "http://localhost:9200",
  elasticIndexPrefix: process.env.ELASTIC_INDEX_PREFIX || "app-logs",
  loggerApiKey: process.env.LOKI_API_KEY || "",
  nodeEnv: process.env.NODE_ENV || "development",
  service: process.env.SERVICE || "",
  lokiHost: process.env.LOKI_HOST || "",
  lokiUserId: process.env.LOKI_USER_ID || "",
};
