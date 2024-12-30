import { MiddlewareFn } from "telegraf";

export const unknownCommandHandler: MiddlewareFn = (ctx) => {
  ctx.reply("Sorry, I didn't understand that command. Please use /help to see the available commands.");
};