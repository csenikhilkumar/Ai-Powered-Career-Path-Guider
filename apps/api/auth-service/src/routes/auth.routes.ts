import type { Router as ExpressRouter } from "express";
import { Router } from "express";
import { getMe, login, register, googleAuth, changePassword } from "../controllers/auth.controller";
import { verifyToken, refreshToken } from "../controllers/token.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router: ExpressRouter = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", authenticate, getMe);
router.post("/verify-token", verifyToken);
router.post("/refresh-token", refreshToken);
router.post("/change-password", authenticate, changePassword);

export default router;
