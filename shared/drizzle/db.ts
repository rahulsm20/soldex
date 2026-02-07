import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

const DATABASE_URL = process.env.DATABASE_URL;
export const db = drizzle(DATABASE_URL);
