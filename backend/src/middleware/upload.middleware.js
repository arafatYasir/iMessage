import multer from "multer";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, callback) => {
        const isImage = file.mimetype.startsWith("image/");
        const isVideo = file.mimetype.startsWith("video/");

        if (!isImage && !isVideo) {
            callback(new Error("Only image and video uploads are allowed"));
            return;
        }

        callback(null, true);
    }
})