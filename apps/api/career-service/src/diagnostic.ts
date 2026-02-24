import { PrismaClient } from '@internal/prisma-career-client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Diagnostic ---');
    try {
        const totalRoadmaps = await prisma.roadmap.count();
        console.log(`Total Roadmaps: ${totalRoadmaps}`);

        const roadmapsWithUser = await prisma.roadmap.count({
            where: { userId: { not: null } }
        });
        console.log(`Roadmaps with userId: ${roadmapsWithUser}`);

        const roadmapsWithoutUser = await prisma.roadmap.count({
            where: { userId: null }
        });
        console.log(`Roadmaps without userId (NULL): ${roadmapsWithoutUser}`);

        if (roadmapsWithoutUser > 0) {
            console.log('Sample of roadmaps without userId:');
            const samples = await prisma.roadmap.findMany({
                where: { userId: null },
                take: 3,
                select: { id: true, title: true, createdAt: true }
            });
            console.log(samples);
        }

    } catch (error) {
        console.error('Error running diagnostic:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
