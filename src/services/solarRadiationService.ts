import SolarRadiation, { ISolarRadiation } from '../models/SolarRadiation';

export const createRadiation = async (data: Partial<ISolarRadiation>) => {
    // Normalize city name: trim and convert to title case
    if (data.city) {
        data.city = data.city.trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    const radiation = new SolarRadiation(data);
    return await radiation.save();
};

export const getAllRadiation = async (skip?: number, limit?: number) => {

    let filter = { isDeleted: false };

    const query = SolarRadiation.find(filter).sort({ updatedAt: -1 });

    if (skip !== undefined && limit !== undefined) {
        const [radiation, total] = await Promise.all([
            query.skip(skip).limit(limit),
            SolarRadiation.countDocuments(filter)
        ]);

        return {
            data: radiation,
            total: total
        };
    }

    return {
        radiation: await query
    };
};

export const getRadiationById = async (id: string) => {
    const radiation = await SolarRadiation.findById(id);
    if (!radiation) throw new Error('Radiation data not found');
    return radiation;
};

export const updateRadiation = async (id: string, data: Partial<ISolarRadiation>) => {
    // Normalize city name if it's being updated
    if (data.city) {
        data.city = data.city.trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    const radiation = await SolarRadiation.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
    );
    if (!radiation) throw new Error('Radiation data not found');
    return radiation;
};

export const deleteRadiation = async (id: string) => {
    const radiation = await SolarRadiation.findByIdAndUpdate(id, { isDeleted: true });

    if (!radiation) throw new Error('Radiation data not found');
    return radiation;
};

export const getActiveRadiation = async () => {
    return await SolarRadiation.find({
        isActive: true,
        status: 'FINALIZED'
    }).sort({ city: 1 });
};

export const getRadiationByCity = async (city: string) => {
    // Normalize the search city name
    const normalizedCity = city.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    const radiation = await SolarRadiation.findOne({
        city: normalizedCity
    }).collation({ locale: 'en', strength: 2 }); // Case-insensitive search

    if (!radiation) throw new Error('Radiation data not found for this city');
    return radiation;
};

export const updateRadiationStatus = async (id: string, status: 'DRAFT' | 'REVIEW' | 'FINALIZED') => {
    const radiation = await SolarRadiation.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
    );
    if (!radiation) throw new Error('Radiation data not found');
    return radiation;
};

export const toggleRadiationActive = async (id: string) => {
    const radiation = await SolarRadiation.findById(id);
    if (!radiation) throw new Error('Radiation data not found');

    radiation.isActive = !radiation.isActive;
    radiation.updatedAt = new Date();
    return await radiation.save();
};

export const getSolarRadiationByLocation = async (latitude: number, longitude: number, year?: number) => {
    const query: any = {
        'location.latitude': latitude,
        'location.longitude': longitude
    };

    if (year) {
        query.year = year;
    }

    return await SolarRadiation.find(query).sort({ year: -1, month: -1 });
}; 