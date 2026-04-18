import dotenv from "dotenv";
import winston from "winston";
import LokiTransport from "winston-loki";
import { config } from "../config";

dotenv.config();
const basicAuth = `${config.lokiUserId}:${config.loggerApiKey}`;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new LokiTransport({
      host: config.lokiHost,
      labels: { service_name: config.service },
      json: true,
      basicAuth,
      format: winston.format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error("loki erro: ", err),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
