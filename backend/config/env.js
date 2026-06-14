import { config } from "dotenv";

config({ path: ".env" });

export const {
    PORT,
    NODE_ENV,
    DB_URI,
    CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY,
    IMAGEKIT_PRIVATE_KEY
} = process.env;