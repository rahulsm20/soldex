import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
config({ path: ".env" });

const url = process.env.DATABASE_URL || "";
export default defineConfig({
  schema: "./shared/drizzle/schema.ts",
  out: "./shared/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
