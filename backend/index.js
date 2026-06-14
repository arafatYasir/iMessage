import express from "express"
import { clerkMiddleware } from '@clerk/express'
import cors from "cors";
import { NODE_ENV, PORT, SITE_URL } from "./config/env.js";
import { connectToDatabase } from "./lib/db.js";
import fs from "fs";
import path from "path";

const app = express();

const publicDir = path.join(process.cwd(), "public");

// Middlewares
app.use(express.json());
app.use(cors({ origin: SITE_URL, credentials: true }));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
    res.status(200).json({ success: true });
});

// if the public directory exists, serve the static files
// this is for the production build
if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));

    app.get("/{*any}", (req, res, next) => {
        res.sendFile(path.join(publicDir, "index.html"), (e) => next(e));
    });
}

app.listen(PORT, async () => {
    console.log(`Server is running on port: ${PORT} in ${NODE_ENV} mode`);

    // Connect to Database
    await connectToDatabase();
});