import { Request, Response, NextFunction } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import logger from './logger';

/**
 * Custom Error class with status code
 */
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    code?: string;

    constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, code?: string) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Predefined error classes for common scenarios
 */
export class BadRequestError extends AppError {
    constructor(message: string = ReasonPhrases.BAD_REQUEST) {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = ReasonPhrases.UNAUTHORIZED) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = ReasonPhrases.FORBIDDEN) {
        super(message, StatusCodes.FORBIDDEN);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = ReasonPhrases.NOT_FOUND) {
        super(message, StatusCodes.NOT_FOUND);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = ReasonPhrases.CONFLICT) {
        super(message, StatusCodes.CONFLICT);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed') {
        super(message, StatusCodes.UNPROCESSABLE_ENTITY);
    }
}

/**
 * Error handler middleware
 * Catches all errors and sends appropriate response
 */
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = err;

    // If it's not an AppError, create one
    if (!(error instanceof AppError)) {
        const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        const message = error.message || ReasonPhrases.INTERNAL_SERVER_ERROR;
        error = new AppError(message, statusCode);
    }

    const appError = error as AppError;

    // Log error
    if (appError.statusCode >= 500) {
        logger.error(`${appError.message}`, {
            statusCode: appError.statusCode,
            stack: (err instanceof AppError) ? appError.stack : (err as Error).stack,
            originalError: err,
            url: req.url,
            method: req.method,
            ip: req.ip,
        });
    } else {
        logger.warn(`${appError.message}`, {
            statusCode: appError.statusCode,
            url: req.url,
            method: req.method,
        });
    }

    // Send response
    res.status(appError.statusCode).json({
        success: false,
        message: appError.message,
        ...(appError.code && { code: appError.code }),
        ...(process.env.NODE_ENV === 'development' && { stack: appError.stack }),
    });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const error = new NotFoundError(`Route ${req.originalUrl} not found`);
    next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
