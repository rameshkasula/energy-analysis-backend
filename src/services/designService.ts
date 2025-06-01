import { redisClient } from '../config/redis';
import BuildingDesign from '../models/BuildingDesign';
import { AppError, ErrorCodes } from '../utils/errorHandler';

export const createDesign = async (data: any) => {
    const design = new BuildingDesign(data);
    return await design.save();
};

export const getAllDesigns = async (skip?: number, limit?: number) => {
    const query = BuildingDesign.find({ isDeleted: false }).sort({ updatedAt: -1 });

    if (skip !== undefined && limit !== undefined) {
        const [designs, total] = await Promise.all([
            query.skip(skip).limit(limit),
            BuildingDesign.countDocuments({ isDeleted: false })
        ]);

        return {
            designs,
            count: total,
        };
    }

    return {
        designs: await query
    };
};

export const getDesignById = async (id: string) => {
    const design = await BuildingDesign.findOne({ _id: id, isDeleted: false });
    if (!design) throw new Error('Design not found');
    return design;
};

export const updateDesign = async (id: string, data: any) => {
    const design = await BuildingDesign.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { ...data, updatedAt: new Date() },
        { new: true }
    );
    let key = `analysis:${id}`;
    await redisClient.del(key);
    if (!design) throw new Error('Design not found');
    return design;
};

export const updateDesignStatus = async (id: string, status: string) => {
    const design = await BuildingDesign.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { status, updatedAt: new Date() },
        { new: true }
    );
    if (!design) throw new Error('Design not found');
    return design;
};

export const softDeleteDesign = async (id: string) => {
    const result = await BuildingDesign.findByIdAndUpdate(id, {
        isDeleted: true,
        updatedAt: new Date(),
    });
    if (!result) throw new Error('Design not found');
    return result;
};

// get design based on the city level
export const getDesignByCity = async (city?: string) => {
    const totalDesigns = await BuildingDesign.countDocuments({ isDeleted: false });

    // Handle multi-city filtering
    const cities = city ? city.split(',').map(c => c.trim()) : [];

    // Prepare $match stage
    const matchStage: Record<string, any> = { isDeleted: false };
    if (cities.length > 0) {
        matchStage.city = { $in: cities };
    }

    // Define aggregation pipeline
    const pipeline: any[] = [
        { $match: matchStage },
        {
            $group: {
                _id: {
                    city: '$city',
                    status: '$status'
                },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: '$_id.city',
                statusCounts: {
                    $push: {
                        status: '$_id.status',
                        count: '$count'
                    }
                },
                totalCityDesigns: { $sum: '$count' }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                city: '$_id',
                statusCounts: 1,
                totalCityDesigns: 1
            }
        }
    ];

    const cityStats = await BuildingDesign.aggregate(pipeline)
        .collation({ locale: 'en', strength: 2 }) // 🔍 case-insensitive match
        .exec();

    return {
        totalDesigns,
        cityStats
    };
};


