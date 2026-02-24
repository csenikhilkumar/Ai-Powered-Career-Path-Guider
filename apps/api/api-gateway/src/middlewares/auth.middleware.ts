import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { httpClient } from "../utils/httpClient";
import { services } from "../config/services";
import { logger } from "../utils/logger";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email?: string;
      };
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = typeof authHeader === "string" ? authHeader.replace(/^Bearer\s+/i, "") : undefined;

    if (!token) {
      return next(new AppError("No token provided", 401));
    }

    const verifyUrl = `${services.auth}/auth/verify-token`;
    const response = await httpClient.post(verifyUrl, { token });

    if (response.data?.valid) {
      req.user = {
        userId: response.data.userId,
        email: response.data.email,
      };
      return next();
    }

    return next(new AppError("Invalid token", 401));
  } catch (err) {
    logger.warn("Authentication failed", { error: String(err) });
    return next(new AppError("Authentication failed", 401));
  }
};
