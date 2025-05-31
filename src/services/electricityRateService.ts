import ElectricityRate, { IElectricityRate } from '../models/ElectricityRate';

export const createRate = async (data: Partial<IElectricityRate>) => {
    // Normalize city name: trim and convert to title case
    if (data.city) {
        data.city = data.city.trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    const rate = new ElectricityRate(data);
    return await rate.save();
};

export const getAllRates = async (skip?: number, limit?: number) => {

    let filter = { isDeleted: false };

    const query = ElectricityRate.find(filter).sort({ updatedAt: -1 });

    if (skip !== undefined && limit !== undefined) {
        const [rates, total] = await Promise.all([
            query.skip(skip).limit(limit),
            ElectricityRate.countDocuments(filter)
        ]);

        return {
            rates,
            total: total
        };
    }

    return {
        rates: await query
    };
};

export const getRateById = async (id: string) => {
    const rate = await ElectricityRate.findById(id);
    if (!rate) throw new Error('Rate not found');
    return rate;
};

export const updateRate = async (id: string, data: Partial<IElectricityRate>) => {
    // Normalize city name if it's being updated
    if (data.city) {
        data.city = data.city.trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    const rate = await ElectricityRate.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
    );
    if (!rate) throw new Error('Rate not found');
    return rate;
};

export const deleteRate = async (id: string) => {
    const rate = await ElectricityRate.findByIdAndUpdate(id, { isDeleted: true });
    if (!rate) throw new Error('Rate not found');
    return rate;
};

export const getActiveRates = async () => {
    return await ElectricityRate.find({
        isActive: true,
        status: 'PUBLISHED'
    }).sort({ city: 1 });
};

export const getRateByCity = async (city: string) => {
    // Normalize the search city name
    const normalizedCity = city.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    const rate = await ElectricityRate.findOne({
        city: normalizedCity
    }).collation({ locale: 'en', strength: 2 }); // Case-insensitive search

    if (!rate) throw new Error('Rate not found for this city');
    return rate;
}; 