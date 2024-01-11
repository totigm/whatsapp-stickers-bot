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

bot.addCommand("image", async (message) => handleImageMessage(message, false), {
    description: "Edit image",
    explanation: "Send an image with the command !image. Optionally, add 'resize=width/height' to resize it.",
    example: {
        input: "image [resize=512/512]",
        output: "image edited",
    },
});
