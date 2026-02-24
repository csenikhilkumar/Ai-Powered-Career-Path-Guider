import type { NextFunction, Request, Response } from "express";
import { AppError } from "./errors";
import { logger } from "./logger";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError
    ? err.message
    : err instanceof Error
      ? err.message
      : "Internal server error";

  logger.error("Request failed", {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message,
    stack: (err as Error).stack,
    originalError: err
  });

  res.status(statusCode).json({ message });
};
