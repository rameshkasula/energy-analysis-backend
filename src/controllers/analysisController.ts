import { Request, Response } from 'express';
import { runAnalysis } from '../services/analysisService';
import { handleSuccess, handleError } from '../utils/responseHandler';
import { redisClient } from '../config/redis';

export const analyzeDesign = async (req: Request, res: Response) => {
    try {
        const result = await runAnalysis(req.params.designId);
        handleSuccess(res, result);
    } catch (err) {
        handleError(res, err, 400);
    }
};



export const getCachedAnalysis = async (req: Request, res: Response) => {
    try {
        const key = `analysis:${req.params.designId}`;
        const data = await redisClient.get(key);

        const analysis = data ? JSON.parse(data) : null;
        if (!analysis) return res.status(404).json({ error: 'No analysis found in cache.' });
        handleSuccess(res, analysis);
    } catch (err) {
        handleError(res, err);
    }
};


export const compareDesigns = async (req: Request, res: Response) => {
    try {
        const ids = (req.query.ids as string)?.split(',') ?? [];
        if (!ids.length) return res.status(400).json({ error: 'No design IDs provided' });

        const results = [];

        for (const id of ids) {
            const data = await redisClient.get(`analysis:${id}`);
            if (data) {
                results.push({
                    designId: id,
                    ...JSON.parse(data),
                });
            }
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No cached results found' });
        }

        handleSuccess(res, results);
    } catch (err) {
        handleError(res, err);
    }
};
