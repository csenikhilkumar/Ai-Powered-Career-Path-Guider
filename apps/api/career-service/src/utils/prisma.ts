import { PrismaClient } from '@internal/prisma-career-client';

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
