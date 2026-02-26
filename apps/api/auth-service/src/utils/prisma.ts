import { PrismaClient } from '@internal/prisma-auth-client';

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
