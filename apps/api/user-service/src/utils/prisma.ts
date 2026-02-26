import { PrismaClient } from "@internal/prisma-user-client";

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
