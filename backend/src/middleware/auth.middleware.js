import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";

export async function protectRoute(req, res, next) {
    try {
        const { userId } = getAuth(req);

        // Checking if user id signed in
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return res.status(404).json({ message: "User profile is not synced yet" });
        }

        // Insert the user object inside request
        req.user = user;

        // Proceed to the next
        next();
    } catch (e) {
        console.error("Error in protectedRoute middleware: ", e.message);

        res.status(500).json({ message: "Internal server error" });
    }
}