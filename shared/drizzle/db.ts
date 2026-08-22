import { config } from "@/config";
import "dotenv/config";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as postgresDrizzle } from "drizzle-orm/node-postgres";
const DATABASE_URL = process.env.DATABASE_URL || "";

export const db =
  config.nodeEnv == "production"
    ? neonDrizzle(DATABASE_URL)
    : postgresDrizzle(DATABASE_URL);
