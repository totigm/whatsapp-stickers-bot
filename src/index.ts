import WhatsappBot from "@totigm/whatsapp-bot";
import { handleImageMessage } from "./image";

const bot = new WhatsappBot();

bot.addCommand("sticker", (message) => handleImageMessage(message, { isSticker: true }), {
    description: "Convert an image or video to a sticker",
    explanation:
        "Send an image or video with the command !sticker. Optionally (only working for images), add resize=width/height, blur=amount, negate, grayscale, brightness=level, saturation=level, hue=level, lightness=level, removebg, bgColor=color, bgImageUrl=URL, text='Your text', textSize=size, textColor=color, textPosition=position to edit the sticker.",
    example: {
        input: "!sticker saturation=10 lightness=25 text='Hello world!' textColor=red textPosition=top",
        output: "sticker with all those changes",
    },
});

bot.addCommand("image", (message) => handleImageMessage(message), {
    description: "Edit image",
    explanation:
        "Send an image with the command !image. Optionally, add resize=width/height, blur=amount, negate, grayscale, brightness=level, saturation=level, hue=level, lightness=level, removebg, bgColor=color, bgImageUrl=URL, text='Your text', textSize=size, textColor=color, textPosition=position to edit the image.",
    example: {
        input: "!image saturation=10 lightness=25 text='Hello world!' textColor=red textPosition=top",
        output: "image with all those changes",
    },
});
