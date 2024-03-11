import WhatsappBot, { WAWebJS } from "@totigm/whatsapp-bot";
import { handleImageMessage } from "./image";
import { handleRecognizeTextImage } from "./textRecognition";

const isProd = ["prod", "production"].includes(process.env.NODE_ENV);

const bot = new WhatsappBot({
    bot: {
        symbol: isProd ? "!" : "??",
    },
    client: {
        authStrategy: new WAWebJS.LocalAuth({
            clientId: isProd ? "prod" : "dev",
        }),
    },
});

bot.addCommand("sticker", (message) => handleImageMessage(message, { isSticker: true }), {
    description: "Convert an image or video to a sticker",
    explanation:
        "Send or quote an image or video with the command !sticker. Optionally (only working for images), add resize=width/height, negate, grayscale/greyscale, blur=level, lightness=level, brightness=level, saturation=level, hue=level, removeBg, bgColor=color, bgImageUrl=URL, text='Your text', textSize=size, textColor=color, and textPosition=position to edit the sticker",
    example: {
        input: "!sticker saturation=10 lightness=25 text='Hello world!' textColor=red textPosition=top",
        output: "sticker with all those changes",
    },
});

bot.addCommand("image", (message) => handleImageMessage(message), {
    description: "Edits an image image",
    explanation:
        "Send or quote an image with the command !image. Optionally, add resize=width/height, negate, grayscale/greyscale, blur=level, lightness=level, brightness=level, saturation=level, hue=level, removeBg, bgColor=color, bgImageUrl=URL, text='Your text', textSize=size, textColor=color, and textPosition=position to edit the image",
    example: {
        input: "!image saturation=10 lightness=25 text='Hello world!' textColor=red textPosition=top",
        output: "image with all those changes",
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
