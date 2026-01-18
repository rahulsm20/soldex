import dotenv from "dotenv";

dotenv.config();

export const config = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  PORT: process.env.PORT ? parseInt(process.env.PORT) : undefined,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  JUPITER_API_KEY: process.env.JUPITER_API_KEY || "",
  AWS_REGION: process.env.AWS_REGION || "",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET_NAME || "",
};
