import { WAWebJS, HandlerMessage } from "@totigm/whatsapp-bot";
import Tesseract from "tesseract.js";

async function recognizeTextFromImage(base64String) {
    try {
        const imageBuffer = Buffer.from(base64String, "base64");
        return Tesseract.recognize(imageBuffer, "eng+spa+fra+deu+ita", { logger: (m) => console.log(m) }).then(
            ({ data: { text } }) => text,
        );
    } catch (error) {
        console.error(error);
        return "There was an error recognizing the text";
    }
}

export const handleRecognizeTextImage = async (message: HandlerMessage<WAWebJS.Message>) => {
    if (!message.hasMedia) {
        return "Send an image to get its text";
    }

    const media = await message.downloadMedia();
    if (!media.data) {
        return "Failed to download media. Please try again.";
    }

    const text = await recognizeTextFromImage(media.data);
    return text;
};
