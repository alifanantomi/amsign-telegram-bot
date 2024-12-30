import { MiddlewareFn } from "telegraf";

export const loggerMiddleware: MiddlewareFn = (ctx, next) => {
  console.log(`Received update: ${JSON.stringify(ctx.update)}`);
  return next();
};
