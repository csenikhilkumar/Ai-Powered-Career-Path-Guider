import GrokClient from '../utils/grokClient';

export class AiService {
    private grokClient: GrokClient;

    constructor() {
        this.grokClient = new GrokClient();
    }

    /**
     * Generate career path analysis from user answers/profile
     */
    async generateCareerPath(answers: any) {
        try {
            return await this.grokClient.analyzeCareerPath(answers);
        } catch (error) {
            console.error('Error generating career path:', error);
            throw new Error('Failed to generate career path analysis');
        }
    }

    /**
     * Chat with AI assistant
     */
    async chat(message: string) {
        try {
            return await this.grokClient.chat(message);
        } catch (error) {
            console.error('Error in AI chat:', error);
            throw new Error('Failed to chat with AI');
        }
    }

    /**
     * Generate personalized insights based on user profile
     */
    async generateInsights(userId: string, profile: any) {
        try {
            const request = {
                userId,
                skills: profile.skills || [],
                interests: profile.interests || [],
                careerGoals: profile.careerGoals
            };

            return await this.grokClient.generateInsights(request);
        } catch (error) {
            console.error('Error generating insights:', error);
            throw new Error('Failed to generate insights');
        }
    }

    /**
     * Explain why a career recommendation matches the user
     */
    async explainRecommendation(userId: string, careerPath: any, userProfile: any) {
        try {
            const request = {
                userId,
                careerPathTitle: careerPath.title,
                careerDescription: careerPath.description,
                userSkills: userProfile.skills?.map((s: any) => s.skillName) || [],
                userInterests: userProfile.interests?.map((i: any) => i.interestName) || [],
                matchScore: careerPath.matchScore || 0
            };

            return await this.grokClient.explainRecommendation(request);
        } catch (error) {
            console.error('Error explaining recommendation:', error);
            throw new Error('Failed to explain recommendation');
        }
    }

    /**
     * Generate a personalized learning roadmap
     */
    async generatePersonalizedRoadmap(userId: string, request: any) {
        try {
            const roadmapRequest = {
                userId,
                careerPathTitle: request.careerPathTitle,
                currentSkills: request.currentSkills || [],
                targetSkills: request.targetSkills || [],
                timeframe: request.timeframe || '6 months'
            };

            return await this.grokClient.generatePersonalizedRoadmap(roadmapRequest);
        } catch (error) {
            console.error('Error generating roadmap:', error);
            throw new Error('Failed to generate personalized roadmap');
        }
    }

    /**
     * Generate personalized learning resources
     */
    async generateLearningResources(userId: string, careerPathTitle: string, currentStage: string, interests: string[]) {
        try {
            const request = {
                userId,
                careerPathTitle,
                currentStage,
                interests
            };

            return await this.grokClient.generateLearningResources(request);
        } catch (error) {
            console.error('Error generating learning resources:', error);
            throw new Error('Failed to generate learning resources');
        }
    }

    /**
     * Check if Grok API is properly configured
     */
    isGrokConfigured(): boolean {
        return this.grokClient.isConfigured();
    }

    /**
     * Get AI service health status
     */
    getHealthStatus() {
        return {
            status: 'healthy',
            grokConfigured: this.isGrokConfigured(),
            model: 'grok-beta',
            features: [
                'Career Path Analysis',
                'Personalized Insights',
                'Recommendation Explanations',
                'Learning Roadmaps'
            ]
        };
    }
}
