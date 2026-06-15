import { Router } from "express"
import { checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.get("/check", protectRoute, checkAuth);

export default authRouter;