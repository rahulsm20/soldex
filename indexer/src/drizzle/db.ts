import { config } from "@/utils/config";
import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sql";

export const db = drizzle(config.DATABASE_URL);
