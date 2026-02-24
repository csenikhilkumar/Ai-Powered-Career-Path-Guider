import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[AuthMiddleware] Request to ${req.method} ${req.url}`);
    console.log(`[AuthMiddleware] Headers: x-user-id=${req.headers['x-user-id']}, auth=${!!req.headers['authorization']}`);

    // 1. Trust Gateway Forwarded Header if available
    const gatewayUserId = req.headers['x-user-id'];
    const gatewayUserEmail = req.headers['x-user-email'];

    if (gatewayUserId) {
        req.user = {
            userId: gatewayUserId,
            email: gatewayUserEmail
        };
        return next();
    }

    // 2. Fallback to JWT Verification
    if (!JWT_SECRET) {
        return res.status(500).json({ message: 'JWT_SECRET is not set. Please configure it in your .env file.' });
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required (No token or gateway header)' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        // Normalize userId format
        req.user = {
            ...decoded,
            userId: decoded.userId || decoded.id || decoded.sub
        };
        next();
    });
};
