import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import { testRedisConnection } from './config/redis';
import { ENV_VARIABLES } from './utils/constants';
import router from './routes/index';
import logger from './utils/logger';
import { logRequest } from './middlewares/loggerMiddleware';

dotenv.config();

const app = express();
const PORT = ENV_VARIABLES.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.use(logRequest); // Log all requests

app.use((err: any, req: any, res: any, next: any) => {
    if (err.message && err.message.includes('pathToRegexpError')) {
        logger.error('Route parsing error:', {
            error: err.message,
            path: req.path,
            method: req.method,
            originalUrl: req.originalUrl
        });

        return res.status(400).json({
            error: 'Invalid route pattern',
            message: 'The requested URL contains invalid characters'
        });
    }

    next(err);
});

// Example route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Energy Analysis API is running',
        success: true,
        version: '1.0.1',
        data: []
    });
});

const startServer = async () => {
    try {
        await connectDB();
        const redisConnected = await testRedisConnection();
        if (!redisConnected) {
            logger.error('Failed to connect to Redis');
            process.exit(1);
        }

        app.listen(PORT, () => {
            logger.info(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
