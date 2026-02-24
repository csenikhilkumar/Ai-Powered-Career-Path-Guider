import { Router } from 'express';
import {
    analyzeCareerPath,
    generateInsights,
    explainRecommendation,
    generateRoadmap,
    getAiHealth,
    chatWithAi,
    generateLearningResources
} from '../controllers/ai.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router: Router = Router();

// Public endpoint for career path analysis
router.post('/analyze', analyzeCareerPath);

// Public chat endpoint (or protected if needed, but dashboard seems to call it openly or with auth?)
// Frontend client.ts sends auth token. So we should use authenticateToken?
// AiAssistantCard implies logged in user.
// But earlier ai.ts calls did not mention auth requirement in comments, but client.ts injects token.
// The route file imports authenticateToken.
router.post('/chat', authenticateToken, chatWithAi);

// Protected endpoints requiring authentication
router.post('/insights', authenticateToken, generateInsights);
router.post('/explain-recommendation', authenticateToken, explainRecommendation);
router.post('/roadmap', authenticateToken, generateRoadmap);
router.post('/resources', authenticateToken, generateLearningResources);
router.post('/recommendations', authenticateToken, generateInsights); // Alias for Frontend compatibility
router.get('/recommendations', authenticateToken, generateInsights); // Alias for Frontend GET compatibility (though insights is POST usually?)

// Health check endpoint
router.get('/health', getAiHealth);

export default router;
