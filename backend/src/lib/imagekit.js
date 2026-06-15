import ImageKit, { toFile } from "@imagekit/nodejs";
import { IMAGEKIT_PRIVATE_KEY } from "../config/env.js";

const imagekit = new ImageKit({ privateKey: IMAGEKIT_PRIVATE_KEY });

function hasImageKitConfig() {
    return Boolean(IMAGEKIT_PRIVATE_KEY);
}

function createFileName(originalName = "upload") {
    const safeName = originalName.replace(/[^a-zA-z0-9._-]/g, "_");
    return `chat-${Date.now()}-${safeName}`;
}

async function uploadChatMedia(file) {
    const fileName = createFileName(file.originalName);

    const result = await imagekit.files.upload({
        file: await toFile(file.buffer, fileName, { type: file.mimetype }),
        fileName,
        folder: "/iMessage"
    });

    return result.url;
}

export { uploadChatMedia, hasImageKitConfig };