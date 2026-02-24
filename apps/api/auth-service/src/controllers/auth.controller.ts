import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authService } from "../services/auth.service";

export const register: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    const result = await authService.register({ email, password, firstName, lastName });
    res.status(201).json(result);
});

export const login: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
});

export const googleAuth: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { idToken, email, firstName, lastName } = req.body;

    if (!idToken || !email) {
        return res.status(400).json({ message: 'ID token and email are required' });
    }

    // For now, we trust the Firebase token and create/login the user
    // In production, you should verify the Firebase token with Firebase Admin SDK
    const result = await authService.googleLogin({ email, firstName, lastName });
    res.json(result);
});

export const getMe: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await authService.getUserById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
});

