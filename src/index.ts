import WhatsappBot from "@totigm/whatsapp-bot";
import sharp from "sharp";

const bot = new WhatsappBot();

interface Transformations {
    resize?: [number, number];
    blur?: number;
    negate?: boolean;
    grayscale?: boolean;
    modulate?: Modulate;
}

interface Modulate {
    brightness?: number | undefined;
    saturation?: number | undefined;
    hue?: number | undefined;
    lightness?: number | undefined;
}

function parseArgs(args) {
    const transformations: Transformations = {};
    const modulate: Modulate = {};
    args.forEach((arg) => {
        const [key, value] = arg.split("=");
        switch (key) {
            case "resize": {
                const dimensions = value.split(/x|\.|\//i).map(Number);
                if (dimensions.length === 2 && dimensions.every(Number.isInteger)) {
                    transformations.resize = dimensions;
                }
                break;
            }
            case "blur": {
                transformations.blur = Number(value);
                break;
            }
            case "negate": {
                transformations.negate = true;
                break;
            }
            case "grayscale": {
                transformations.grayscale = true;
                break;
            }
            case "brightness": {
                modulate.brightness = parseFloat(value);
                break;
            }
            case "saturation": {
                modulate.saturation = parseFloat(value);
                break;
            }
            case "hue": {
                modulate.hue = parseFloat(value);
                break;
            }
            case "lightness": {
                modulate.lightness = parseFloat(value);
                break;
            }
        }
    });

    if (Object.keys(modulate).length > 0) {
        transformations.modulate = modulate;
    }

    return transformations;
}

async function processMedia(media, transformations: Transformations) {
    let pipeline = sharp(Buffer.from(media.data, "base64"));

    if (transformations.resize) {
        pipeline = pipeline.resize(...transformations.resize);
    }
    if (transformations.blur) {
        pipeline = pipeline.blur(transformations.blur);
    }
    if (transformations.negate) {
        pipeline = pipeline.negate();
    }
    if (transformations.grayscale) {
        pipeline = pipeline.grayscale();
    }
    if (transformations.modulate) {
        pipeline = pipeline.modulate(transformations.modulate);
    }

    const processedBuffer = await pipeline.toBuffer();
    return processedBuffer.toString("base64");
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

            const transformations = parseArgs(message.args);
            const transformationsAmount = Object.keys(transformations).length;
            if (transformationsAmount) media.data = await processMedia(media, transformations);

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
