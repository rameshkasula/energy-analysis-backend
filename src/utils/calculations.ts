const solarRadiationData: Record<string, Record<string, number>> = {
    Bangalore: { north: 150, south: 250, east: 200, west: 200, roof: 300 },
    Mumbai: { north: 180, south: 350, east: 280, west: 270, roof: 400 },
    Kolkata: { north: 200, south: 400, east: 300, west: 290, roof: 450 },
    Delhi: { north: 160, south: 270, east: 220, west: 220, roof: 320 },
};

const electricityRates: Record<string, number> = {
    Bangalore: 6.5,
    Mumbai: 9.0,
    Kolkata: 7.5,
    Delhi: 8.5,
};

const COP = 4;

export function calculateEnergyAnalysis(design: any) {
    const { facades, shgc, city, exposureHours, skylight } = design;
    const radiation = solarRadiationData[city];
    const rate = electricityRates[city];
    const result: Record<string, any> = {};
    let totalBTU = 0;

    // Per-facade heat gain
    for (const direction of ['north', 'south', 'east', 'west']) {
        const facade = facades[direction];
        const area = facade.height * facade.width * facade.wwr;
        const Q = area * shgc * radiation[direction] * exposureHours;
        result[direction] = { area, Q: parseFloat(Q.toFixed(2)) };
        totalBTU += Q;
    }

    // Skylight
    if (skylight?.height && skylight?.width) {
        const area = skylight.height * skylight.width;
        const Q = area * shgc * radiation.roof * exposureHours;
        result['roof'] = { area, Q: parseFloat(Q.toFixed(2)) };
        totalBTU += Q;
    }

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
        timestamp: new Date(),
    };
}
