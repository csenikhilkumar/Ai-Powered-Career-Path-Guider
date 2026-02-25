import { PrismaClient } from '@internal/prisma-career-client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // 1. Create Career Paths
    const softwareEngineer = await prisma.careerPath.upsert({
        where: { id: 'se-path-001' },
        update: {},
        create: {
            id: 'se-path-001',
            title: 'Full Stack Developer',
            description: 'Master both frontend and backend technologies to build complete web applications.',
            category: 'Software Engineering',
            avgSalary: 85000,
            growthRate: 15,
            difficulty: 'Intermediate',
            matchScore: 0,
            salary: '$70k - $120k',
            growth: 'High',
            demand: 'High',
            growthSpeed: 'Fast',
            requiredSkills: 'JavaScript, React, Node.js, PostgreSQL, Docker',
        },
    });

    const dataScientist = await prisma.careerPath.upsert({
        where: { id: 'ds-path-001' },
        update: {},
        create: {
            id: 'ds-path-001',
            title: 'Data Scientist',
            description: 'Extract insights from complex data to drive business decisions using statistical and AI techniques.',
            category: 'Data & AI',
            avgSalary: 95000,
            growthRate: 25,
            difficulty: 'Advanced',
            matchScore: 0,
            salary: '$90k - $150k',
            growth: 'Very High',
            demand: 'Exceptional',
            growthSpeed: 'Explosive',
            requiredSkills: 'Python, R, Machine Learning, Statistics, SQL',
        },
    });

    console.log({ softwareEngineer, dataScientist });

    // 2. Create sample roadmap items for a default user (if needed, but usually roadmaps are user-specific)
    // For now, we seed the career paths which are the "source" for roadmaps.

    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
