import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { CLERK_WEBHOOK_SIGNING_SECRET } from "../config/env.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const signingSecret = CLERK_WEBHOOK_SIGNING_SECRET;
    try {
        if (!signingSecret) {
            return res.status(503).json({
                message: "Webhook secret is not provided"
            });
        }

        const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);
        const request = new Request("http://internal/webhooks/clerk", {
            method: "POST",
            headers: new Headers(req.headers),
            body: payload
        });

        const event = await verifyWebhook(request, { signingSecret });

        if (event.type === "user.created" || event.type === "user.updated") {
            const user = event.data;

            const email = user.email_addresses?.find((e) => e.id === user.primary_email_address_id)?.email_address ?? user.email_addresses?.[0]?.email_address;

            const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || email?.split("@")[0];

            await User.findOneAndUpdate(
                { clerkId: user.id },
                { clerkId: user.id, email, fullName, profilePic: user.image_url },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
        }
        else if (event.type === "user.deleted") {
            const user = event.data;

            if (user.id) {
                await User.findOneAndDelete({ clerkId: user.id });
            }
        }

        res.status(200).json({ received: true });
    } catch (e) {
        console.error("Error in clerk webhook: ", e);
        res.status(400).json({ message: "Webhook verification failed" });
    }
})

export default router;