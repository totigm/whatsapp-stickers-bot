import { WAWebJS, HandlerMessage } from "@totigm/whatsapp-bot";
import sharp from "sharp";
import Jimp from "jimp";
import { removeBackgroundFromImageBase64, RemoveBgBase64Options } from "remove.bg";
import "dotenv/config";

interface Transformations {
    resize?: [number, number];
    blur?: number;
    negate?: boolean;
    grayscale?: boolean;
    modulate?: Partial<Modulate>;
    removeBg?: boolean;
    backgroundOptions?: Partial<BackgroundOptions>;
    text?: string;
}

interface Modulate {
    brightness?: number | undefined;
    saturation?: number | undefined;
    hue?: number | undefined;
    lightness?: number | undefined;
}

interface BackgroundOptions {
    bgColor?: string;
    bgImageUrl?: string;
}

async function removeBackground(base64img: string, options?: BackgroundOptions) {
    try {
        const apiKey = process.env.REMOVE_BG_API_KEY;
        if (!apiKey) {
            throw "There's no API key defined for removing the background";
        }

        const defaultOptions: Partial<RemoveBgBase64Options> = {
            position: "center",
            crop: true,
            format: "png",
        };

        const mappedOptions: Partial<RemoveBgBase64Options> = {
            ...(options?.bgColor && { bg_color: options.bgColor }), // Add bg_color only if options.bgColor is defined
            ...(options?.bgImageUrl && { bg_image_url: options.bgImageUrl }), // Add bg_image_url only if options.bgImageUrl is defined
        };

        const { base64img: resultImage } = await removeBackgroundFromImageBase64({
            apiKey,
            base64img,
            ...defaultOptions,
            ...mappedOptions,
        });

        if (!resultImage) {
            throw "There was an error removing the background";
        }

        return resultImage;
    } catch (err) {
        const error = err as { title: string; code: string };
        throw typeof err === "string" ? err : error.title;
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
    // TODO: Define font and size.
    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);

    const textDimensions = Jimp.measureText(font, text);

    const image = new Jimp(textDimensions, 128, "transparent");
    image.print(font, 0, 0, text);

    return await image.getBufferAsync(Jimp.MIME_PNG);
}

function parseNumber(value: unknown): number | undefined {
    // Attempt to convert the value to a number using parseFloat
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    // Check if the value is a number and not NaN
    if (typeof numericValue === "number" && !isNaN(numericValue)) {
        return numericValue;
    }

    // If it's not a number or cannot be converted, return undefined
    return undefined;
}

function parseArgs(argsMap: { [key: string]: string | true }) {
    const transformations: Transformations = {};
    const modulate: Modulate = {};
    const backgroundOptions: BackgroundOptions = {};

    for (const key in argsMap) {
        const value = argsMap[key];
        switch (key.toLowerCase()) {
            case "resize": {
                if (typeof value !== "string") {
                    throw new Error("Invalid input: Resize arg needs a string");
                }

                // Split with 'x', '/', or '.'
                const dimensions = value.split(/x|\.|\//i).map(Number);
                if (dimensions.length < 2 && !dimensions.every(Number.isInteger)) {
                    throw new Error("Invalid input: Resize arg needs two values separated by 'x', slash, or point");
                }

                const [width, height] = dimensions;
                transformations.resize = [width, height];

                break;
            }
            case "text": {
                if (typeof value !== "string") {
                    throw new Error("Invalid input: Text arg need a string");
                }

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
            case "bgcolor": {
                if (typeof value !== "string") {
                    throw "Invalid input: Background color arg need a string";
                }

                backgroundOptions.bgColor = value;
                break;
            }
            case "bgimageurl": {
                if (typeof value !== "string") {
                    throw "Invalid input: Background image url arg need a string";
                }

                backgroundOptions.bgImageUrl = value;
                break;
            }
            case "brightness": {
                const parsedNumber = parseNumber(value);
                if (!parsedNumber) {
                    throw new Error("Invalid input: Brightness arg needs to be a number");
                }

                modulate.brightness = parsedNumber;
                break;
            }
            case "saturation": {
                const parsedNumber = parseNumber(value);
                if (!parsedNumber) {
                    throw new Error("Invalid input: Saturation arg needs to be a number");
                }

                modulate.saturation = parsedNumber;
                break;
            }
            case "hue": {
                const parsedNumber = parseNumber(value);
                if (!parsedNumber) {
                    throw new Error("Invalid input: Hue arg needs to be a number");
                }

                modulate.hue = parsedNumber;
                break;
            }
            case "lightness": {
                const parsedNumber = parseNumber(value);
                if (!parsedNumber) {
                    throw new Error("Invalid input: Lightness arg needs to be a number");
                }

                modulate.lightness = parsedNumber;
                break;
            }
        }
    }

    if (Object.keys(modulate).length > 0) {
        transformations.modulate = modulate;
    }
    if (Object.keys(backgroundOptions).length > 0) {
        transformations.removeBg = true;
        transformations.backgroundOptions = backgroundOptions;
    }

    return transformations;
}

async function processMedia(media, transformations: Transformations) {
    let mediaBuffer = Buffer.from(media.data, "base64");

    if (transformations.removeBg) {
        const mediaWithoutBackground = await removeBackground(media.data, transformations.backgroundOptions);
        if (mediaWithoutBackground) mediaBuffer = Buffer.from(mediaWithoutBackground, "base64");
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

        // TODO: Add option for the user to select the gravity and color
        const gravity = mapGravity("top");

        pipeline = pipeline.composite([{ input: textImageBuffer, gravity }]);
    }

    const processedBuffer = await pipeline.toBuffer();
    return processedBuffer.toString("base64");
}

type ImageOptions = {
    isSticker?: boolean;
};

export const handleImageMessage = async (message: HandlerMessage<WAWebJS.Message>, { isSticker = false }: ImageOptions = {}) => {
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

        const transformations = parseArgs(message.argsMap);
        const transformationsAmount = Object.keys(transformations).length;
        if (transformationsAmount) media.data = await processMedia(media, transformations);

        const messageOptions = isSticker
            ? {
                  sendMediaAsSticker: true,
                  stickerAuthor: "@totigm/bot",
              }
            : null;

        message.reply(media, message.from, messageOptions);
    } catch (err) {
        console.error(`Error processing ${typeText} command: ${err}`);
        return `An error occurred while processing your ${typeText}.\n\n${err}`;
    }
};
