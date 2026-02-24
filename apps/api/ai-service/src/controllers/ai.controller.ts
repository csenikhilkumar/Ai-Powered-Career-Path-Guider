import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AiService } from '../services/ai.service';
import { BadRequestError, UnauthorizedError, asyncHandler } from '../utils/errorHandler';
import logger from '../utils/logger';

const aiService = new AiService();

/**
 * Analyze career path based on user answers
 * POST /ai/analyze
 */
export const analyzeCareerPath = asyncHandler(async (req: Request, res: Response) => {
    const { answers } = req.body;

    if (!answers) {
        throw new BadRequestError('Answers are required');
    }

    logger.info('Analyzing career path for user');
    const result = await aiService.generateCareerPath(answers);

    logger.info('Career path analysis completed successfully');
    res.status(StatusCodes.OK).json({
        success: true,
        data: result
    });
});

/**
 * Chat with AI assistant
 * POST /ai/chat
 */
export const chatWithAi = asyncHandler(async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
        throw new BadRequestError('Message is required');
    }

    logger.info('Processing AI chat message');
    const response = await aiService.chat(message);

    res.status(StatusCodes.OK).json({
        success: true,
        data: { response }
    });
});

/**
 * Generate personalized insights for user
 * POST /ai/insights
 */
export const generateInsights = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId || req.headers['x-user-id'];
    const { skills, interests, careerGoals } = req.body;

    if (!userId) {
        throw new UnauthorizedError('User ID is required');
    }

    logger.info(`Generating insights for user: ${userId}`);
    const profile = { skills, interests, careerGoals };
    const result = await aiService.generateInsights(userId as string, profile);

    logger.info(`Insights generated successfully for user: ${userId}`);
    res.status(StatusCodes.OK).json({
        success: true,
        data: result
    });
});

/**
 * Explain a career recommendation
 * POST /ai/explain-recommendation
 */
export const explainRecommendation = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId || req.headers['x-user-id'];
    const { careerPath, userProfile } = req.body;

    if (!userId) {
        throw new UnauthorizedError('User ID is required');
    }

    if (!careerPath || !userProfile) {
        throw new BadRequestError('Career path and user profile are required');
    }

    logger.info(`Explaining recommendation for user: ${userId}, career: ${careerPath.title}`);
    const result = await aiService.explainRecommendation(
        userId as string,
        careerPath,
        userProfile
    );

    logger.info(`Recommendation explained successfully for user: ${userId}`);
    res.status(StatusCodes.OK).json({
        success: true,
        data: result
    });
});

/**
 * Generate personalized learning roadmap
 * POST /ai/roadmap
 */
export const generateRoadmap = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId || req.headers['x-user-id'];
    const { careerPathTitle, currentSkills, targetSkills, timeframe } = req.body;

    if (!userId) {
        throw new UnauthorizedError('User ID is required');
    }

    if (!careerPathTitle || !currentSkills || !targetSkills) {
        throw new BadRequestError('Career path title, current skills, and target skills are required');
    }

    logger.info(`Generating roadmap for user: ${userId}, career: ${careerPathTitle}`);
    const request = {
        careerPathTitle,
        currentSkills,
        targetSkills,
        timeframe: timeframe || '6 months'
    };

    const result = await aiService.generatePersonalizedRoadmap(userId as string, request);

    logger.info(`Roadmap generated successfully for user: ${userId}`);
    res.status(StatusCodes.OK).json({
        success: true,
        data: result
    });
});

/**
 * Get AI service health and configuration status
 * GET /ai/health
 */
export const getAiHealth = asyncHandler(async (req: Request, res: Response) => {
    logger.debug('AI service health check requested');
    const health = aiService.getHealthStatus();

    res.status(StatusCodes.OK).json({
        success: true,
        data: health
    });
});
/**
 * Generate personalized learning resources
 * POST /ai/resources
 */
export const generateLearningResources = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId || req.headers['x-user-id'];
    const { careerPathTitle, currentStage, interests } = req.body;

    if (!userId) {
        throw new UnauthorizedError('User ID is required');
    }

    if (!careerPathTitle) {
        throw new BadRequestError('Career path title is required');
    }

    logger.info(`Generating learning resources for user: ${userId}, career: ${careerPathTitle}`);
    const result = await aiService.generateLearningResources(
        userId as string,
        careerPathTitle,
        currentStage || 'Beginner',
        interests || []
    );

    logger.info(`Learning resources generated successfully for user: ${userId}`);
    res.status(StatusCodes.OK).json({
        success: true,
        data: result
    });
});

