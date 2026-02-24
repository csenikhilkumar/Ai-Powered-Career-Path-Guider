import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CAREERS = [
    {
        title: "Senior Frontend Engineer",
        description: "Lead frontend architecture and build scalable user interfaces using React and TypeScript.",
        matchScore: 92,
        salary: "$120k - $160k",
        growth: "High",
        demand: "Very High",
    },
    {
        title: "Full Stack Developer",
        description: "Build end-to-end web applications involving both frontend and backend technologies.",
        matchScore: 78,
        salary: "$100k - $140k",
        growth: "Stable",
        demand: "High",
    },
    {
        title: "UX Engineer",
        description: "Bridge the gap between design and engineering to create intuitive user experiences.",
        matchScore: 65,
        salary: "$90k - $130k",
        growth: "Rising",
        demand: "Medium",
    }
];

async function main() {
    console.log('Start seeding...');

    // Clear existing data to avoid duplicates if re-seeding
    // await prisma.careerPath.deleteMany(); 

    for (const career of CAREERS) {
        await prisma.careerPath.create({
            data: {
                title: career.title,
                description: career.description,
                matchScore: career.matchScore,
                salary: career.salary,
                growth: career.growth,
                demand: career.demand,

                // Optional existing fields
                difficulty: "Medium",
            }
        });
        console.log(`Created career: ${career.title}`);
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
