import type { Router as ExpressRouter } from "express";
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { getProfile, updateProfile } from "../controllers/user.controller";

const router: ExpressRouter = Router();

router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);

export default router;
