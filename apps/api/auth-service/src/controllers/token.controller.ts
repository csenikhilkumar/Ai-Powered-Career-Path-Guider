import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authService } from "../services/auth.service";

export const verifyToken: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body as { token?: string };
  const result = await authService.verifyToken(token);
  res.json(result);
});
