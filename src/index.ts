import WhatsappBot from "@totigm/whatsapp-bot";

const bot = new WhatsappBot();

bot.addCommand(
    "sticker",
    async (message) => {
        if (message.hasMedia) {
            const media = await message.downloadMedia();
            if (media.data)
                message.reply(media, message.from, {
                    sendMediaAsSticker: true,
                });
        } else message.reply("Send an image or video to convert it to a sticker");
    },
    {
        description: "Convert an image or video to a sticker",
        explanation: "Send an image or video with the text !sticker and you will get it as an sticker",
        example: {
            input: "image/video",
            output: "sticker",
        },
    },
);
