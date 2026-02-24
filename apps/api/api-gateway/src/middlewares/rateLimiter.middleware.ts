import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export const rateLimiter = (options?: { windowMs?: number; max?: number }) => {
  const windowMs = options?.windowMs ?? 15 * 60 * 1000;
  const max = options?.max ?? 100;

  return (req: Request, _res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip || "unknown";

    const existing = buckets.get(key);
    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    existing.count += 1;
    if (existing.count > max) {
      return next(new AppError("Too many requests, please try again later.", 429));
    }

    return next();
  };
};
