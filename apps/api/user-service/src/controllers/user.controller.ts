import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { userService } from "../services/user.service";

export const getProfile: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId as string;
    const profile = await userService.getProfile(userId);
    res.json({ user: profile });
});

export const updateProfile: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId as string;
    const email = (req as any).user.email as string;
    const profile = await userService.updateProfile(userId, email, req.body);
    res.json({ user: profile });
});

