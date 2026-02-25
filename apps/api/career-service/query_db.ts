import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roadmaps = await prisma.roadmap.findMany({
    include: {
      items: true,
      careerPath: true
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: 5
  });

  console.log(JSON.stringify(roadmaps, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
