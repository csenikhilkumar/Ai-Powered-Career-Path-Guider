import { client } from './client';

export interface CareerPath {
    id: string;
    title: string;
    description: string;
    category?: string;
    avgSalary?: number;
    growthRate?: number;
    difficulty?: string;
    // UI/Mock fields
    matchScore?: number;
    salary?: string;
    growth?: string;
    demand?: string;
    growthSpeed?: string;
    requiredSkills?: string[];
    skills?: string[];
    resources?: { title: string; type: string; duration?: string; url?: string }[];
}

export type RoadmapStep = RoadmapItem;

export interface RoadmapItem {
    id: string;
    title: string;
    description?: string;
    status: 'locked' | 'active' | 'completed' | 'current' | 'upcoming';
    duration?: string;
    order: number;
    estimatedHours?: number;
    resources?: string[];
}

export interface Roadmap {
    id: string;
    title: string;
    description?: string;
    items: RoadmapItem[];
    careerPathId?: string;
    careerPath?: CareerPath;
    phases?: any;
}

export const careerApi = {
    // Fetch all career paths (catalog)
    getCareers: async () => {
        const response = await client.get<{ data: CareerPath[] }>('/careers/paths');
        return response.data.data;
    },

    // Fetch specific career details
    getCareerById: async (id: string) => {
        const response = await client.get<{ career: CareerPath }>(`/careers/paths/${id}`);
        return response.data.career;
    },

    // Get the user's active roadmap
    getUserRoadmap: async () => {
        const response = await client.get<{ roadmap: Roadmap }>('/careers/roadmap');
        return response.data.roadmap;
    },

    // Get all roadmaps for the user
    getUserRoadmaps: async () => {
        const response = await client.get<{ roadmaps: Roadmap[] }>('/careers/roadmaps');
        return response.data.roadmaps;
    },

    // Fetch roadmap for a specific career path (template)
    getRoadmap: async (careerId: string) => {
        // This endpoint might need to be created on backend, for now we mock or try a convention
        try {
            const response = await client.get<{ roadmap: RoadmapItem[] }>(`/careers/paths/${careerId}/roadmap`);
            return response.data.roadmap;
        } catch (error) {
            console.warn("Failed to fetch roadmap template", error);
            return [];
        }
    },

    // Create a new roadmap (e.g. from AI result)
    saveRoadmap: async (data: {
        title: string,
        description?: string,
        careerPathId?: string,
        items: any[],
        category?: string,
        avgSalary?: number,
        growthRate?: number,
        difficulty?: string,
        matchScore?: number,
        salary?: string,
        growth?: string,
        demand?: string,
        growthSpeed?: string,
        requiredSkills?: string[],
        phases?: any
    }) => {
        const response = await client.post<{ roadmap: Roadmap }>('/careers/roadmap', data);
        return response.data.roadmap;
    },

    // Update a roadmap item's status
    updateRoadmapItem: async (roadmapId: string, itemId: string, status: string) => {
        const response = await client.put<{ item: RoadmapItem }>(`/careers/roadmap/${roadmapId}/items/${itemId}`, { status });
        return response.data.item;
    }
};
