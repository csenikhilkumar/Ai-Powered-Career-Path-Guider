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
        const response = await client.post<{ data: any }>('/ai/resources', params);
        return response.data.data;
    }
};

export const AiInteraction = aiApi;
