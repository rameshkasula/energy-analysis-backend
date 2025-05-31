import BuildingDesign from '../models/BuildingDesign';

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
