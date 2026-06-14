import express from "express"
import { clerkMiddleware } from '@clerk/express'
import cors from "cors";
import { NODE_ENV, PORT, SITE_URL } from "./config/env.js";
import { connectToDatabase } from "./lib/db.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: SITE_URL, credentials: true }));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
    res.status(200).json({ success: true });
})

app.listen(PORT, async () => {
    console.log(`Server is running on port: ${PORT} in ${NODE_ENV} mode`);

    // Connect to Database
    await connectToDatabase();
});