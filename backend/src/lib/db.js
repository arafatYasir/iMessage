import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

export async function connectToDatabase() {
    try {
        if (!DB_URI) {
            throw new Error("DB_URI is required in .env file");
        }
        
        const conn = await mongoose.connect(DB_URI);

        console.log("---------- Database Connected ----------", conn.connection.host);
    } catch (e) {
        console.error("MongoDB connection error: ", e.message);
        process.exit(1);
    }
}