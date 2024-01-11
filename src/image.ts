import { WhatsappWeb, HandlerMessage } from "@totigm/whatsapp-bot";
import sharp from "sharp";
import axios from "axios";
import FormData from "form-data";
import Jimp from "jimp";

interface Transformations {
    resize?: [number, number];
    blur?: number;
    negate?: boolean;
    grayscale?: boolean;
    modulate?: Modulate;
    removeBg?: boolean;
    text?: string;
}

interface Modulate {
    brightness?: number | undefined;
    saturation?: number | undefined;
    hue?: number | undefined;
    lightness?: number | undefined;
}

async function removeBackground(imageBuffer: Buffer) {
    const formData = new FormData();
    formData.append("size", "auto");
    formData.append("image_file", imageBuffer, "image.jpg");

    try {
        const response = await axios({
            method: "post",
            url: "https://api.remove.bg/v1.0/removebg",
            data: formData,
            responseType: "arraybuffer",
            headers: {
                ...formData.getHeaders(),
                "X-Api-Key": "ksFKDjxfSEZURANzsxYrC6cZ",
            },
        });

        if (response.status !== 200) {
            console.error("Error:", response.status, response.statusText);
            return null;
        }

        return response.data;
    } catch (error) {
        console.error("Request failed:", error);
        return null;
    }
}

const GRAVITY_MAP = {
    top: "north",
    topright: "northeast",
    right: "east",
    bottomright: "southeast",
    bottom: "south",
    bottomleft: "southwest",
    left: "west",
    topleft: "northwest",
    center: "center",
};

function mapGravity(direction) {
    return GRAVITY_MAP[direction.toLowerCase()] || "center"; // Retorna 'center' como valor por defecto
}

async function createTextImage(text: string) {
    // definir color
    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);

    const textDimensions = Jimp.measureText(font, text);

    const image = new Jimp(textDimensions, 128, "transparent");
    image.print(font, 0, 0, text);

    return await image.getBufferAsync(Jimp.MIME_PNG);
}

function parseArgs(args) {
    const transformations: Transformations = {};
    const modulate: Modulate = {};
    args.forEach((arg) => {
        const [key, value] = arg.split("=");
        switch (key.toLowerCase()) {
            case "resize": {
                const dimensions = value.split(/x|\.|\//i).map(Number);
                if (dimensions.length === 2 && dimensions.every(Number.isInteger)) {
                    transformations.resize = dimensions;
                }
                break;
            }
            case "text": {
                // debería aceptar comillas para que vaya todo el texto ahí, nos va a trollear el args del bot
                transformations.text = value;
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
            case "removebg": {
                transformations.removeBg = true;
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
    let mediaBuffer = Buffer.from(media.data, "base64");

    if (transformations.removeBg) {
        mediaBuffer = await removeBackground(mediaBuffer);
    }

    let pipeline = sharp(mediaBuffer);

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
    if (transformations.text) {
        const textImageBuffer = await createTextImage(transformations.text);
        const gravity = mapGravity("top");

        pipeline = pipeline.composite([{ input: textImageBuffer, gravity }]);
    }

    const processedBuffer = await pipeline.toBuffer();
    return processedBuffer.toString("base64");
}

type ImageOptions = {
    isSticker?: boolean;
};

export const handleImageMessage = async (message: HandlerMessage<WhatsappWeb.Message>, { isSticker = false }: ImageOptions = {}) => {
    if (!message.hasMedia) {
        return "Send an image or video to convert it to a sticker";
    }

    const typeText = isSticker ? "sticker" : "image";

    try {
        message.reply(`Processing your ${typeText}...`, message.from);

        const media = await message.downloadMedia();
        if (!media.data) {
            return "Failed to download media. Please try again.";
        }

        const transformations = parseArgs(message.args);
        const transformationsAmount = Object.keys(transformations).length;
        if (transformationsAmount) media.data = await processMedia(media, transformations);

        const messageOptions = isSticker
            ? {
                  sendMediaAsSticker: true,
                  stickerAuthor: "@totigm/bot",
              }
            : null;

        message.reply(media, message.from, messageOptions);

        return "";
    } catch (error) {
        console.error(`Error processing ${typeText} command: ${error}`);
        return `An error occurred while processing your ${typeText}. Please try again.`;
    }
};
