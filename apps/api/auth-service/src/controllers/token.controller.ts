import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authService } from "../services/auth.service";

export const verifyToken: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body as { token?: string };
  const result = await authService.verifyToken(token);
  res.json(result);
});

export const refreshToken: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body as { refreshToken?: string };
  if (!token) {
    return res.status(400).json({ message: "Refresh token is required" });
  }
  const result = await authService.refreshToken(token);
  res.json(result);
});
