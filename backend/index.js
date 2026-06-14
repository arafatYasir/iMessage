import express from "express"
import { NODE_ENV, PORT } from "./config/env.js";

const app = express();

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT} in ${NODE_ENV} mode`);
});