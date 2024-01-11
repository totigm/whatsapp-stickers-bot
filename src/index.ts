import WhatsappBot from "@totigm/whatsapp-bot";
import { handleImageMessage } from "./image";

const bot = new WhatsappBot();

bot.addCommand("sticker", async (message) => handleImageMessage(message, true), {
    description: "Convert an image or video to a sticker",
    explanation: "Send an image or video with the command !sticker. Optionally, add 'resize=width/height' to resize the sticker.",
    example: {
        input: "image [resize=512/512]",
        output: "sticker",
    },
});
