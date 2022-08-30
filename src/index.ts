import WhatsappBot from "@totigm/whatsapp-bot";

const bot = new WhatsappBot();

bot.addCommand("hello", () => "world!");
