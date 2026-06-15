import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { hasImageKitConfig, uploadChatMedia } from "../lib/imagekit.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export async function getUsersForSidebar(req, res) {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-clerkId");

        res.status(200).json(filteredUsers);
    } catch (e) {
        console.error("Error in getUsersForSidebar: ", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getChatsForSidebar(req, res) {
    try {
        const loggedInUserId = req.user._id;

        const chats = await Message.aggregate([
            // Keep only the messages I sent or recieved
            { $match: { $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }] } },

            // Collapse them into one row per chat partner, noting our latest message time
            {
                $group: {
                    _id: { $cond: [{ $eq: ["$senderId", loggedInUserId] }, "$receiverId", "$senderId"] },
                    lastMessageAt: { $max: "$createdAt" }
                }
            },

            // Put the most recent chat at the top
            { $sort: { lastMessageAt: -1 } },

            // Look up each partner's user profile
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },

            // Pull that profile out of the array and make it the document
            { $replaceRoot: { newRoot: { $first: "$user" } } },

            // Hide the private clerkId field from the result
            { $project: { clerkId: 0 } }
        ]);

        res.status(200).json(chats);
    } catch (e) {
        console.error("Error in getChatsForSidebar: ", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMessages(req, res) {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, recieverId: myId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (e) {
        console.error("Error in getMessages: ", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function sendMessage(req, res) {
    try {
        const { text } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl, videoUrl;

        if (req.file) {
            if (!hasImageKitConfig()) {
                return res.status(500).json({ message: "Media upload is not configured" });
            }

            const url = await uploadChatMedia(req.file);

            if (req.file.mimetype.startsWith("image/")) {
                imageUrl = url;
            }
            else videoUrl = url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl || "",
            video: videoUrl || ""
        });

        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (e) {
        console.error("Error in sendMessage: ", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}