import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "./utils/env";
import { startCommand } from "./bot/commands/start";
import { registerCommand } from "./bot/commands/register";
import { helpCommand } from "./bot/commands/help";
import { unknownCommandHandler } from "./bot/handlers/unknownCommand";
import { loggerMiddleware } from "./bot/middlewares/logger";

export const setupBot = () => {
  const bot = new Telegraf(BOT_TOKEN);

  // Register middlewares
  bot.use(loggerMiddleware);

  // Register commands
  startCommand(bot);
  registerCommand(bot);
  helpCommand(bot);

  // Catch unknown commands
  bot.on("message", unknownCommandHandler);

  return bot;
};
