import dotenv from "dotenv";

dotenv.config();

export const config = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  HELIUS_API_KEY: process.env.HELIUS_API_KEY || "",
};
