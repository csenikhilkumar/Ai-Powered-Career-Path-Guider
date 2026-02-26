import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import aiRoutes from './routes/ai.routes';
import { errorHandler, notFoundHandler } from './utils/errorHandler';
import logger, { stream } from './utils/logger';

const app: Express = express();
const PORT = process.env.AI_PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(morgan('combined', { stream }));

// Routes
app.use('/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'AI Service',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`AI Service running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Grok API configured: ${process.env.GROK_API_KEY ? 'Yes' : 'No (using mock data)'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Promise Rejection:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

export default app;