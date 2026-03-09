import { client } from './client';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export const aiApi = {
    chat: async (message: string) => {
        const response = await client.post<{ data: { response: string } }>('/ai/chat', { message });
        return response.data.data.response;
    },

    getInsights: async () => {
        const response = await client.get('/ai/insights');
        return response.data;
    },

    submitAssessment: async (answers: number[]) => {
        const response = await client.post<{ data: any }>('/ai/assessment', { answers });
        return response.data.data;
    },

    analyzeCareerPath: async (answers: any) => {
        const response = await client.post<{ data: any }>('/ai/analyze', { answers });
        return response.data.data; // Returns recommendation with match score
    },

    generateRoadmap: async (params: { careerPathTitle: string, currentSkills: any[], targetSkills: string[], timeframe: string }) => {
        const response = await client.post<{ data: any }>('/ai/roadmap', params);
        return response.data.data;
    },

    generateResources: async (params: { careerPathTitle: string, currentStage: string, interests: string[] }) => {
        // Create a unique cache key based on the specific path and current progress level
        const cacheKey = `ai_resources_${params.careerPathTitle.replace(/[^a-zA-Z0-9]/g, '')}_${params.currentStage.replace(/[^a-zA-Z0-9]/g, '')}`;

        try {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                console.log(`[AI Cache] Loaded resources for ${params.careerPathTitle} from local storage`);
                return JSON.parse(cachedData);
            }
        } catch (e) {
            console.warn("[AI Cache] Failed to read from local storage", e);
        }

        const response = await client.post<{ data: any }>('/ai/resources', params);
        const data = response.data.data;

        try {
            localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (e) {
            console.warn("[AI Cache] Failed to write to local storage", e);
        }

        return data;
    }
};

export const AiInteraction = aiApi;
