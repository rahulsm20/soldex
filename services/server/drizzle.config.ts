import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;
console.log({ DATABASE_URL });
export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
