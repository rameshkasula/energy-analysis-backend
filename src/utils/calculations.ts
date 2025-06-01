import logger from './logger';

const COP = 4;

export function calculateEnergyAnalysis(
    design: any,
    electricityRate: { rate: number },
    solarRadiation: { radiation: Record<string, number> }
) {
    const { facades, shgc, city, exposureHours, skylight } = design;

    const radiation = solarRadiation?.radiation;
    const rate = electricityRate?.rate;

    if (!radiation || typeof rate !== 'number') {
        throw new Error('Radiation or electricity rate data missing');
    }

    const result: Record<string, any> = {};
    let totalBTU = 0;

    logger.info(`🔋 Using electricity rate: ${rate}`);
    logger.info(`🌞 Radiation for ${city}:`, radiation);

    // 1. Facade-wise Q
    for (const direction of ['north', 'south', 'east', 'west']) {
        const facade = facades[direction];
        const area = facade.height * facade.width * facade.wwr;
        const Q = area * shgc * radiation[direction] * exposureHours;
        result[direction] = { area, Q: parseFloat(Q.toFixed(2)) };
        totalBTU += Q;
    }

    // 2. Skylight Q (if used — optional)
    if (skylight?.height && skylight?.width && radiation.roof) {
        const area = skylight.height * skylight.width;
        const Q = area * shgc * radiation.roof * exposureHours;
        result['roof'] = { area, Q: parseFloat(Q.toFixed(2)) };
        totalBTU += Q;
    }

    // 3. Final outputs
    const coolingLoad = totalBTU / 3412;
    const energyUsed = coolingLoad / COP;
    const cost = energyUsed * rate;

    return {
        details: result,
        totalBTU: parseFloat(totalBTU.toFixed(2)),
        coolingLoad: parseFloat(coolingLoad.toFixed(2)),
        energyUsed: parseFloat(energyUsed.toFixed(2)),
        estimatedCost: parseFloat(cost.toFixed(2)),
        city,
        timestamp: new Date()
    };
}
