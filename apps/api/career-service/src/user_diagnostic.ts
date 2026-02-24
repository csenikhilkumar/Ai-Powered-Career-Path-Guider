import { PrismaClient as CareerClient } from '@internal/prisma-career-client';

const careerPrisma = new CareerClient();

async function main() {
    console.log('--- User-Roadmap Mapping Diagnostic ---');
    try {
        const roadmaps = await careerPrisma.roadmap.groupBy({
            by: ['userId'],
            _count: {
                _all: true
            }
        });

        console.log('Roadmap counts per userId:');
        roadmaps.forEach(r => {
            console.log(`User ID: ${r.userId} - Count: ${r._count._all}`);
        });

        if (roadmaps.length === 0) {
            console.log('No roadmaps found in database.');
        }

    } catch (error) {
        console.error('Error running diagnostic:', error);
    } finally {
        await careerPrisma.$disconnect();
    }
}

main();
