import { setupBot } from "./bot";

const bot = setupBot();

bot.launch().then(() => {
  console.log("Bot is running...");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
