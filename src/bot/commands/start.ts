import { Context, Telegraf } from "telegraf";

const userStates = new Map<number, string>(); // Map to track user states (userId -> state)

export const startCommand = (bot: Telegraf) => {
  bot.start((ctx: Context) => {
    ctx.reply("Welcome to the bot! Send your UDID to start registration.");
  });

  bot.on("text", (ctx: Context) => {
      const userId = ctx.from?.id;
      const userState = userId ? userStates.get(userId) : null;

      if (!userId) return;
  
      if (userState === "awaiting_udid") {
        const udid = ctx.message.text;
  
        // Validate the UDID (basic example)
        if (!/^[A-Z0-9]{8,}$/.test(udid)) {
          ctx.reply("Invalid UDID format. Please send a valid UDID.");
          return;
        }
  
        // Clear the state after receiving the UDID
        userStates.delete(userId);
  
        ctx.reply(`Thank you! Your UDID "${udid}" has been received. Proceeding with registration...`);
        
        setTimeout(() => {
          // Simulate registration processing (e.g., check database or API)
          const isAlreadyRegistered = false; // Example logic for database check
  
          if (isAlreadyRegistered) {
            ctx.reply(`Your UDID "${udid}" is already registered.`);
          } else {
            // Generate payment link after timeout
            const paymentLink = `https://payment.example.com/pay?udid=${udid}`;
            ctx.reply(`Registration is not complete. Please make a payment to proceed:\n${paymentLink}`);
          }
  
          // Clear the user state
          userStates.delete(userId);
        }, 3000); // 3-second timeout for simulation
      }
    });
};
