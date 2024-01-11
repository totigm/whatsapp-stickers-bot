import WhatsappBot from "@totigm/whatsapp-bot";
import { handleImageMessage } from "./image";
import { handleRecognizeTextImage } from "./textRecognition";

const bot = new WhatsappBot();

bot.addCommand("sticker", (message) => handleImageMessage(message, { isSticker: true }), {
    description: "Convert an image or video to a sticker",
    explanation: "Send an image or video with the command !sticker. Optionally, add 'resize=width/height' to resize the sticker.",
    example: {
        input: "image [resize=512/512]",
        output: "sticker",
    },
});

bot.addCommand("image", (message) => handleImageMessage(message), {
    description: "Edit image",
    explanation: "Send an image with the command !image. Optionally, add 'resize=width/height' to resize it.",
    example: {
        input: "image [resize=512/512]",
        output: "image edited",
    },
});

bot.addCommand("recognizeText", handleRecognizeTextImage, {
    description: "Recognizes text from an image",
    explanation: "Send an image and get the text from it",
    example: {
        input: "image",
        output: "This is a test image",
    },
});
