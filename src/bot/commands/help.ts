import { Telegraf, Context } from "telegraf";

export const helpCommand = (bot: Telegraf) => {
  bot.command("help", (ctx: Context) => {
    ctx.reply("Here are the commands you can use:\n/register - Register your UDID\n/help - Get help");
  });
};
