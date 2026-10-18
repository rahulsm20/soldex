import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY ?? "",
  ALCHEMY_AUTH_TOKEN: process.env.ALCHEMY_AUTH_TOKEN ?? "",
};
