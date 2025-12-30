import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;

export default defineConfig({
  schema: "../shared/drizzle/schema.ts",
  out: "../shared/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
