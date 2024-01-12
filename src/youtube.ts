import { HandlerMessage, WAWebJS } from "@totigm/whatsapp-bot";
import ytdl from "ytdl-core";
// import fs from "fs";
import path from "path";

export const handleYoutubeVideo = async (message: HandlerMessage<WAWebJS.Message>) => {
    const youtubeUrl = message.args[0]; // Extrae la URL del mensaje
    console.log({ youtubeUrl });
    if (!ytdl.validateURL(youtubeUrl)) {
        // return "Please send a valid YouTube URL.";
    }

    const filePath = path.join(__dirname, "yQgquKDIYJ0.mp4");
    console.log({ filePath });
    const media = WAWebJS.MessageMedia.fromFilePath(filePath);
    await message.reply(media, message.from); // Enviar el video como media

    // try {
    //     message.reply("Downloading video from YouTube...", message.from);
    //     const videoId = ytdl.getURLVideoID(youtubeUrl);
    //     const videoStream = ytdl(youtubeUrl, { quality: "highest" });
    //     const filePath = path.join(__dirname, `${videoId}.mp4`);

    //     videoStream.pipe(fs.createWriteStream(filePath));
    //     videoStream.on("end", async () => {
    //         console.log("1");
    //         const media = WAWebJS.MessageMedia.fromFilePath(filePath);

    //         console.log("2");

    //         await message.reply(media, message.from); // Enviar el video como media
    //         console.log("3");

    //         fs.unlinkSync(filePath); // Elimina el archivo después de enviarlo
    //         // return null;
    //     });

    //     // return null;
    // } catch (error) {
    //     console.error(`Error downloading YouTube video: ${error}`);
    //     // return "An error occurred while downloading the video. Please try again.";
    // }
};
