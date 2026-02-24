import type { Router as ExpressRouter } from "express";
import { Router } from "express";
import { getMe, login, register, googleAuth } from "../controllers/auth.controller";
import { verifyToken } from "../controllers/token.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router: ExpressRouter = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", authenticate, getMe);
router.post("/verify-token", verifyToken);

export default router;
