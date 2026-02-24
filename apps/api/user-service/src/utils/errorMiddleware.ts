import type { NextFunction, Request, Response } from "express";
import { AppError } from "./errors";
import { logger } from "./logger";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const appErr = err instanceof AppError ? err : new AppError("Internal server error", 500);

  logger.error("Request failed", {
    method: req.method,
    path: req.originalUrl,
    statusCode: appErr.statusCode,
    message: appErr.message,
  });

  res.status(appErr.statusCode).json({
    message: appErr.message,
  });
};
