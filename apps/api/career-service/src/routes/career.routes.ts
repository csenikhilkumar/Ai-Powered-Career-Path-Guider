import { Router } from 'express';
import { getCareers, getCareerById, getUserRoadmap, getUserRoadmaps, createRoadmap, updateRoadmapItem, deleteRoadmap } from '../controllers/career.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router: Router = Router();

router.get('/careers', getCareers);
router.get('/paths', getCareers);
router.get('/paths/:id', getCareerById);
router.get('/roadmap', authenticateToken, getUserRoadmap);
router.get('/roadmaps', authenticateToken, getUserRoadmaps);
router.post('/roadmap', authenticateToken, createRoadmap);
router.put('/roadmap/:id/items/:itemId', authenticateToken, updateRoadmapItem);
router.delete('/roadmap/:id', authenticateToken, deleteRoadmap);

export default router;
