import BuildingDesign from '../models/BuildingDesign';
import { redisClient } from '../config/redis';
import { calculateEnergyAnalysis } from '../utils/calculations';
import ElectricityRate from '../models/ElectricityRate';
import SolarRadiation from '../models/SolarRadiation';
import logger from '../utils/logger';

export async function runAnalysis(designId: string) {
    const cacheKey = `analysis:${designId}`;

    // 1. Try Redis cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
        logger.info(`♻️ Cache hit for ${designId}`);
        return JSON.parse(cached);
    }

    // 2. Fetch design
    const design = await BuildingDesign.findById(designId).lean();
    if (!design || design.isDeleted) throw new Error('Design not found or deleted');

    logger.info(`🔍 Running analysis for design ${designId}`);

    // 3. Fetch electricity rate
    const electricityRate = await ElectricityRate.findOne({ city: design.city }).lean();
    if (!electricityRate) throw new Error(`Electricity rate not found for city ${design.city}`);

    logger.info(`⚡ Electricity rate for ${design.city}: ${electricityRate.rate}`);

    // 4. Fetch solar radiation
    const solarRadiation = await SolarRadiation.findOne({ city: design.city }).lean();
    if (!solarRadiation) throw new Error(`Solar radiation not found for city ${design.city}`);

    logger.info(`☀️ Solar radiation data loaded for ${design.city}`);

    // 5. Run analysis
    const result = calculateEnergyAnalysis(design, electricityRate, solarRadiation);

    logger.info(`🔍 Analysis result: ${JSON.stringify(result)}`);

    // 6. Cache result
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // cache for 1 hour

    logger.info(`✅ Analysis complete for ${designId}. Result cached.`);
    return result;
}
