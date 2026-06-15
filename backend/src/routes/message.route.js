import { Router } from "express";
import { getUsersForSidebar, getChatsForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/upload.middleware.js";

const messageRouter = Router();

// Middleware
messageRouter.use(protectRoute);

messageRouter.get("/users", getUsersForSidebar);
messageRouter.get("/chats", getChatsForSidebar);
messageRouter.get("/:id", getMessages);
messageRouter.post("/send/:id", upload.single("media"), sendMessage);

export default messageRouter;