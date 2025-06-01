import mongoose, { Schema, Document } from 'mongoose';

interface FacadeConfig {
    height: number;
    width: number;
    wwr: number;
}

interface Skylight {
    height: number;
    width: number;
}

export interface IBuildingDesign extends Document {
    name: string;
    city: string;
    facades: {
        north: FacadeConfig;
        south: FacadeConfig;
        east: FacadeConfig;
        west: FacadeConfig;
    };
    shgc: number;
    skylight?: Skylight;
    exposureHours: number;
    isDeleted: boolean;
    isActive: boolean;
    status: 'DRAFT' | 'REVIEW' | 'FINALIZED' | 'REJECTED';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const FacadeSchema = new Schema<FacadeConfig>({
    height: { type: Number, required: true },
    width: { type: Number, required: true },
    wwr: { type: Number, required: true, min: 0, max: 1 },
});

const BuildingDesignSchema = new Schema<IBuildingDesign>(
    {
        name: { type: String, required: true },
        city: {
            type: String,
            required: true,
            trim: true
        },
        facades: {
            north: { type: FacadeSchema, required: true },
            south: { type: FacadeSchema, required: true },
            east: { type: FacadeSchema, required: true },
            west: { type: FacadeSchema, required: true },
        },
        shgc: { type: Number, required: true },
        skylight: {
            height: Number,
            width: Number,
        },
        exposureHours: { type: Number, required: true },
        isDeleted: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ['DRAFT', 'REVIEW', 'FINALIZED', 'REJECTED'],
            default: 'DRAFT',
        },
        isActive: { type: Boolean, default: true },
        notes: { type: String },
    },
    { timestamps: true }
);

// 🔁 Enable case-insensitive filtering on city + status + isDeleted
BuildingDesignSchema.index(
    { city: 1, isDeleted: 1, status: 1 },
    {
        collation: { locale: 'en', strength: 2 } // case-insensitive
    }
);

// 🔎 Index for quick filtering active/not-deleted records
BuildingDesignSchema.index({ isDeleted: 1, isActive: 1 });

export default mongoose.model<IBuildingDesign>('BuildingDesign', BuildingDesignSchema);
