import BuildingDesign from '../models/BuildingDesign';
import { redisClient } from '../config/redis';
import { calculateEnergyAnalysis } from '../utils/calculations';

export async function runAnalysis(designId: string) {
    const cacheKey = `analysis:${designId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const design = await BuildingDesign.findById(designId);
    if (!design || design.isDeleted) throw new Error('Design not found or deleted');

    const result = calculateEnergyAnalysis(design);
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // 1 hour cache
    return result;
}
