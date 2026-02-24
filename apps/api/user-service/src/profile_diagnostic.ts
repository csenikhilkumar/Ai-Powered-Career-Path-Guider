import { PrismaClient } from '@internal/prisma-user-client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- User Profile Diagnostic ---');
    try {
        const users = await prisma.userProfile.findMany({
            select: { userId: true, email: true }
        });
        console.log('Users found:');
        console.log(users);
    } catch (error) {
        console.error('Error running diagnostic:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
