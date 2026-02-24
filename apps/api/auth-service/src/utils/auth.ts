import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const requireEnv = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} is not set. Please configure it in your .env file.`);
    }
    return value;
};

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, requireEnv('JWT_SECRET'), { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, requireEnv('JWT_REFRESH_SECRET'), { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, requireEnv('JWT_SECRET'));
};
