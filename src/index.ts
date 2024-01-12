import WhatsappBot from "@totigm/whatsapp-bot";
import { handleImageMessage } from "./image";
import { handleYoutubeVideo } from "./youtube";

const bot = new WhatsappBot();

// const bot = new WhatsappBot({
//     client: {
//         puppeteer: {
//             executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
//         },
//     },
// });

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

bot.addCommand("youtube", handleYoutubeVideo, {
    description: "Download and send a YouTube video",
    explanation: "Send a YouTube link with the command !youtube to download and send the video.",
    example: {
        input: "https://www.youtube.com/watch?v=example",
        output: "video file",
    },
});
