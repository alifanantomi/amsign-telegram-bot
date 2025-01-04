import { Context, Markup, Telegraf } from "telegraf";
import { checkUDIDRegistration, registerUDID } from "../../services/appleApi";

const userStates = new Map<number, string>();

export const startCommand = (bot: Telegraf) => {
  bot.start((ctx: Context) => {
    const userId = ctx.from?.id;
    if (userId) {
      userStates.set(userId, "idle");
    }

    ctx.reply(
      "Welcome to the bot! Please choose an option below to proceed.",
      Markup.inlineKeyboard([
        [Markup.button.callback("Check UDID", "check_udid")],
        [Markup.button.callback("Get UDID", "get_udid")],
      ])
    );
  });

  bot.action("check_udid", (ctx) => {
    const userId = ctx.from?.id;
    if (userId) {
      userStates.set(userId, "awaiting_udid");
    }

    ctx.answerCbQuery();
    ctx.reply("Please enter your UDID (e.g., `00008110-0085D828C7312E`):");
  });

  bot.on("text", async (ctx: Context) => {
    const userId = ctx.from?.id;
    const userState = userId ? userStates.get(userId) : null;

    if (!userId) return;

    if (userState === "awaiting_udid") {
      const udid = ctx.message.text.trim();

      if (!/^[A-F0-9]{8}-[A-F0-9]{16}$/i.test(udid)) {
        ctx.reply("Invalid UDID format. Please ensure it matches this pattern: `00008110-0085D828C7312E`.");
        return;
      }

      userStates.delete(userId);

      try {
        ctx.reply(`Checking registration status for UDID: "${udid}"...`);

        const device = await checkUDIDRegistration(udid);

        if (device) {
          // UDID is registered, show device details
          ctx.reply(`
            The UDID "${udid}" is already registered.
            Device Name: ${device.attributes.name}
            UDID: ${device.attributes.udid}
            Platform: ${device.attributes.platform}
          `);
        } else {
          // UDID is not registered, proceed with registration
          ctx.reply(`The UDID "${udid}" is not registered. Attempting to register now...`);

          const registeredDevice = await registerUDID(udid, ctx.from?.first_name || "Unnamed Device");

          ctx.reply(`
            Registration successful!
            Device Name: ${registeredDevice.attributes.name}
            UDID: ${registeredDevice.attributes.udid}
          `);
        }
      } catch (error) {
        ctx.reply("An error occurred while processing your UDID. Please try again later.");
      }
    } else {
      ctx.reply("Please select an option from the menu first.");
    }
  });
};
