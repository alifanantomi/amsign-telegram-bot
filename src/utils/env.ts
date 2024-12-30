import { config } from "dotenv";

config();

export const BOT_TOKEN = process.env.BOT_TOKEN || "";

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined in the .env file.");
}
