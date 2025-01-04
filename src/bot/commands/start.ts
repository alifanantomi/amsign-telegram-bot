import { Context, Markup, Telegraf } from "telegraf";
import { format } from "date-fns";
import { checkUDIDRegistration, registerUDID } from "../../services/appleApi";
import { generatePaymentLink, verifyPaymentStatus } from "../../utils/payment";
import { formatDeviceDetails } from "../../utils/deviceDetails";

const userStates = new Map<number, { state: string; udid?: string; reffCode?: string }>();

export const startCommand = (bot: Telegraf) => {
  // Start Command
  bot.start((ctx: Context) => {
    const userId = ctx.from?.id;
    if (userId) {
      userStates.set(userId, { state: "idle" });
    }

    ctx.reply(
      "Welcome to the bot! Please choose an option below to proceed.",
      Markup.inlineKeyboard([
        [Markup.button.callback("Get UDID", "get_udid")],
      ])
    );
  });

  // Action: Get UDID
  bot.action("get_udid", (ctx) => {
    const userId = ctx.from?.id;
    if (userId) {
      userStates.set(userId, { state: "awaiting_udid" });
    }

    ctx.answerCbQuery();
    ctx.reply("Please enter your UDID");
  });

  // Handle Text Input
  bot.on("text", async (ctx: Context) => {
    if (!ctx.message || !("text" in ctx.message)) {
      ctx.reply("Unexpected message format. Please send text only.");
      return;
    }
    
    const userId = ctx.from?.id;
    const userState = userId ? userStates.get(userId) : null;

    if (!userId) return;

    if (userState?.state === "awaiting_udid") {
      const udid = ctx.message.text.trim();

      if (!/^[A-F0-9]{8}-[A-F0-9]{16}$/i.test(udid)) {
        ctx.reply("Invalid UDID format.");
        return;
      }

      try {
        ctx.reply(`Checking registration status for UDID: "${udid}"...`);

        const device = await checkUDIDRegistration(udid);

        
        if (device) {
          const response = formatDeviceDetails(device);
          ctx.reply(response, { parse_mode: "Markdown" });

        } else {
          // If not registered, initiate payment and registration process
          const { link, reffCode } = generatePaymentLink(udid);
          userStates.set(userId, { state: "awaiting_payment", udid, reffCode });

          ctx.reply(
            `The UDID "${udid}" is not registered.\nPlease complete your payment using the link below:\n[Payment Link](${link})`,
            { parse_mode: "Markdown" }
          );
        }
      } catch (error) {
        console.log({error});
        
        ctx.reply("An error occurred while processing your UDID. Please try again later.");
      }
    } else if (userState?.state === "awaiting_payment") {
      ctx.reply("Please complete your payment before proceeding with the registration.");
    } else {
      ctx.reply("Please select an option from the menu first.");
    }
  });

  // Confirm Payment Command
  bot.command("confirm_payment", async (ctx: Context) => {
    const userId = ctx.from?.id;
    const userState = userId ? userStates.get(userId) : null;

    if (!userId || userState?.state !== "awaiting_payment" || !userState.reffCode || !userState.udid) {
      ctx.reply("No pending payment or registration process found. Please start over.");
      return;
    }

    try {
      ctx.reply("Verifying your payment status...");

      const paymentSuccessful = await verifyPaymentStatus(userState.reffCode);

      if (paymentSuccessful) {
        ctx.reply(`Payment confirmed. Proceeding with registration for UDID: "${userState.udid}"...`);

        const device = await registerUDID(userState.udid, ctx.from?.first_name || "Unnamed Device");

        const response = formatDeviceDetails(device);
        ctx.reply(response, { parse_mode: "Markdown" });

        userStates.delete(userId); // Clear user state
      } else {
        ctx.reply("Payment verification failed. Please try again or contact support.");
      }
    } catch (error) {
      ctx.reply("An error occurred while verifying your payment. Please try again later.");
    }
  });
};
