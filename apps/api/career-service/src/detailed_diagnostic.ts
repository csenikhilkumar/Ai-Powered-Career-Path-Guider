import { PrismaClient } from '@internal/prisma-career-client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Detailed Database Integrity Check ---');
    try {
        const totalRoadmaps = await prisma.roadmap.count();
        const totalCareers = await prisma.careerPath.count();

        console.log(`Summary: ${totalRoadmaps} roadmaps, ${totalCareers} career paths.`);

        const roadmaps = await prisma.roadmap.findMany({
            include: { careerPath: true }
        });

        console.log('Roadmap Details:');
        roadmaps.forEach(r => {
            console.log(`- ID: ${r.id}`);
            console.log(`  Title: ${r.title}`);
            console.log(`  User: ${r.userId}`);
            console.log(`  CareerPath: ${r.careerPath ? r.careerPath.title : 'MISSING!'}`);
        });

    } catch (error) {
        console.error('Error running diagnostic:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
