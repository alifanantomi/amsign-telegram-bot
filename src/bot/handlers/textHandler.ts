import { MiddlewareFn } from "telegraf";

export const textHandler: MiddlewareFn = async (ctx) => {
  const message = ctx.message?.text || "";
  ctx.reply(`You sent: ${message}`);
};