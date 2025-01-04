import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

// Environment variables
export const BOT_TOKEN = process.env.BOT_TOKEN || "";
export const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID || "";
export const APPLE_KEY_ID = process.env.APPLE_KEY_ID || "";

const privateKeyPath = path.resolve(__dirname, "../../AuthKey_AH8BCV6X88.p8");
export const APPLE_PRIVATE_KEY = fs.readFileSync(privateKeyPath, "utf8");


if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined in the .env file.");
}

if (!APPLE_TEAM_ID || !APPLE_KEY_ID || !APPLE_PRIVATE_KEY) {
  throw new Error("Apple Developer API credentials are not fully defined in the .env file.");
}