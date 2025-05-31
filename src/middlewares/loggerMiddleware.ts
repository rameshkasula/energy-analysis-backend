import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.originalUrl}`);
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
};
