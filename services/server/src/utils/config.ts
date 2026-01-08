import dotenv from "dotenv";

dotenv.config();

export const config = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  PORT: process.env.PORT ? parseInt(process.env.PORT) : undefined,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};
