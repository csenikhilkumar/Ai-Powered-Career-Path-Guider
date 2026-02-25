import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

// Keep mock roadmap for now as per plan, can be moved to DB later
const MOCK_ROADMAP = [
    {
        id: "1",
        title: "Master React Fundamentals",
        description: "Hooks, Context, and Component patterns",
        status: "completed",
        duration: "2 weeks",
    },
    {
        id: "2",
        title: "Advanced TypeScript",
        description: "Generics, Utility types, and Type inference",
        status: "current",
        duration: "3 weeks",
    },
    {
        id: "3",
        title: "System Design",
        description: "Scalability, Performance and Architecture",
        status: "locked",
        duration: "4 weeks",
    },
];

export const getCareers = async (req: Request, res: Response) => {
    try {
        const { category, difficulty, minSalary, maxSalary } = req.query;

        const where: any = {};

        if (category) {
            where.category = { equals: String(category), mode: 'insensitive' };
        }

        if (difficulty) {
            where.difficulty = { equals: String(difficulty), mode: 'insensitive' };
        }

        if (minSalary || maxSalary) {
            where.avgSalary = {};
            if (minSalary) where.avgSalary.gte = Number(minSalary);
            if (maxSalary) where.avgSalary.lte = Number(maxSalary);
        }

        const careers = await prisma.careerPath.findMany({ where });
        res.json({ data: careers });
    } catch (error) {
        console.error('Error fetching careers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCareerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Career ID is required" });
        }

        const career = await prisma.careerPath.findUnique({
            where: { id: String(id) }
        });

        if (!career) {
            return res.status(404).json({ message: "Career not found" });
        }

        res.json({ career });
    } catch (error) {
        console.error('Error fetching career:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getRoadmap = async (req: Request, res: Response) => {
    try {
        // ideally fetching based on a specific career or user progress
        // for now, fetching the first available roadmap to replace the mock
        const roadmap = await prisma.roadmap.findFirst({
            include: {
                items: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        if (!roadmap) {
            // Fallback to empty or null if no roadmap exists yet
            return res.json({ roadmap: [] });
        }

        // transforming to match the structure expected by frontend if needed
        // or simply returning the items
        res.json({ roadmap: roadmap.items });
    } catch (error) {
        console.error('Error fetching roadmap:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createRoadmap = async (req: Request, res: Response) => {
    try {
        const {
            title,
            description,
            items,
            careerPathId,
            category,
            avgSalary,
            growthRate,
            difficulty,
            matchScore,
            salary,
            growth,
            demand,
            requiredSkills
        } = req.body;
        const userId = req.user?.userId; // From auth middleware

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Check if career path exists, if provided.
        let targetCareerPathId = careerPathId;

        if (!targetCareerPathId) {
            // Create a generic/custom career path entry with full metadata
            const newCareer = await prisma.careerPath.create({
                data: {
                    title: title || "Custom Career Path",
                    description: description,
                    category,
                    avgSalary,
                    growthRate,
                    difficulty,
                    matchScore,
                    salary,
                    growth,
                    demand,
                    growthSpeed: req.body.growthSpeed,
                    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills.join(', ') : requiredSkills
                }
            });
            targetCareerPathId = newCareer.id;
        }

        const roadmap = await prisma.roadmap.create({
            data: {
                title: title,
                description: description,
                userId: userId,
                careerPathId: targetCareerPathId,
                items: {
                    create: items.map((item: any, index: number) => ({
                        title: item.title,
                        description: item.description,
                        status: item.status || "locked",
                        duration: item.duration,
                        order: index
                    }))
                },
                phases: req.body.phases || undefined
            },
            include: {
                items: true
            }
        });

        res.status(201).json({ roadmap });
    } catch (error) {
        console.error('Error creating roadmap:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateRoadmapItem = async (req: Request, res: Response) => {
    try {
        const { id, itemId } = req.params; // roadmap id, item id
        const { status } = req.body;

        // Verify ownership access (omitted for brevity, but ideally check roadmap.userId === req.user.userId)

        const updatedItem = await prisma.roadmapItem.update({
            where: { id: String(itemId) },
            data: { status }
        });

        res.json({ item: updatedItem });
    } catch (error) {
        console.error('Error updating roadmap item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserRoadmap = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const roadmap = await prisma.roadmap.findFirst({
            where: { userId },
            include: {
                items: { orderBy: { order: 'asc' } },
                careerPath: true
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json({ roadmap });
    } catch (error) {
        console.error('Error fetching user roadmap:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserRoadmaps = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        console.log(`[CareerService] Fetching roadmaps for userId: "${userId}"`);

        if (!userId) {
            console.warn('[CareerService] No userId found in request - returning 401');
            return res.status(401).json({ message: "Unauthorized" });
        }

        const roadmaps = await prisma.roadmap.findMany({
            where: { userId },
            include: {
                items: { orderBy: { order: 'asc' } },
                careerPath: true
            },
            orderBy: { updatedAt: 'desc' }
        });

        console.log(`[CareerService] Found ${roadmaps.length} roadmaps for user "${userId}"`);
        const firstRoadmap = roadmaps[0];
        if (firstRoadmap) {
            console.log(`[CareerService] Sample Roadmap: ${firstRoadmap.title} (ID: ${firstRoadmap.id})`);
        } else {
            // Diagnostic check: Count ALL roadmaps to see if we're connected right
            const totalCount = await prisma.roadmap.count();
            console.log(`[CareerService] Total roadmaps in DB (any user): ${totalCount}`);
        }

        res.json({ roadmaps });
    } catch (error) {
        console.error('Error fetching user roadmaps:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteRoadmap = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // 1. Find roadmap and check ownership
        const roadmap = await prisma.roadmap.findUnique({
            where: { id: String(id) }
        });

        if (!roadmap) {
            return res.status(404).json({ message: "Roadmap not found" });
        }

        if (roadmap.userId !== userId) {
            return res.status(403).json({ message: "You don't have permission to delete this roadmap" });
        }

        // 2. Perform deletion (cascading RoadmapItem manually or use transaction)
        await prisma.$transaction([
            prisma.roadmapItem.deleteMany({
                where: { roadmapId: String(id) }
            }),
            prisma.roadmap.delete({
                where: { id: String(id) }
            })
        ]);

        res.json({ message: "Roadmap deleted successfully" });
    } catch (error) {
        console.error('Error deleting roadmap:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
