import { CronJob } from "cron";
import http from "node:http";
import https from "node:https";
import { SITE_URL } from "../config/env.js";

// every 14 minutes send a GET request to the health endpoint
const job = new CronJob("*/14 * * * *", function () {
    if (!SITE_URL) return;
    const url = new URL("/health", SITE_URL).href;
    const client = url.startsWith("https:") ? https : http;

    client
        .get(url, (res) => {
            if (res.statusCode === 200) console.log("GET request sent successfully");
            else console.log("GET request failed", res.statusCode);
        })
        .on("error", (e) => console.error("Error while sending request", e));
});

export default job;