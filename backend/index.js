import express from "express"
import { NODE_ENV, PORT } from "./config/env.js";
import { connectToDatabase } from "./lib/db.js";

const app = express();

app.get("/health", (req, res) => {
    res.status(200).json({ success: true });
})

app.listen(PORT, async () => {
    console.log(`Server is running on port: ${PORT} in ${NODE_ENV} mode`);

    // Connect to Database
    await connectToDatabase();
});