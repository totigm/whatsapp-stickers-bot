import WhatsappBot from "@totigm/whatsapp-bot";
import sharp from "sharp";

const bot = new WhatsappBot();

function parseResizeArgs(args) {
    const resizeArg = args.find((arg) => arg.includes("resize"));

    if (resizeArg) {
        const dimensions = resizeArg
            .split("=")[1]
            // Split with 'x', '.', or '/', also ignore case for 'x'
            .split(/x|\.|\//i)
            .map(Number);
        if (dimensions.length === 2 && dimensions.every(Number.isInteger)) return dimensions;
    }

    return null;
}

async function resizeMedia(media, dimensions) {
    const mediaBuffer = Buffer.from(media.data, "base64");
    const resizedBuffer = await sharp(mediaBuffer)
        .resize(...dimensions)
        .toBuffer();
    return resizedBuffer.toString("base64");
}

bot.addCommand(
    "sticker",
    async (message) => {
        if (!message.hasMedia) {
            return "Send an image or video to convert it to a sticker";
        }

        try {
            message.reply("Processing your sticker...", message.from);

            const media = await message.downloadMedia();
            if (!media.data) {
                return "Failed to download media. Please try again.";
            }

            const dimensions = parseResizeArgs(message.args);
            if (dimensions) {
                media.data = await resizeMedia(media, dimensions);
            }

            message.reply(media, message.from, {
                sendMediaAsSticker: true,
                stickerAuthor: "TotiBot",
            });

            return "";
        } catch (error) {
            console.error("Error processing sticker command:", error);
            return "An error occurred while processing your sticker. Please try again.";
        }
    },
    {
        description: "Convert an image or video to a sticker",
        explanation: "Send an image or video with the command !sticker. Optionally, add 'resize=width/height' to resize the sticker.",
        example: {
            input: "image/video [resize=512/512]",
            output: "sticker",
        },
    },
);
