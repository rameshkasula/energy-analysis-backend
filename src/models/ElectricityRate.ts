import mongoose, { Schema, Document } from 'mongoose';

export interface IElectricityRate extends Document {
    city: string;
    rate: number;
    unit: string;
    isActive: boolean;
    isDeleted: boolean;
    status: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ElectricityRateSchema = new Schema({
    city: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100,
        // Allow any city name format but ensure it's not empty
        validate: {
            validator: function (v: string) {
                return v.trim().length > 0;
            },
            message: 'City name cannot be empty'
        }
    },
    rate: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        default: 'kWh'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        required: true,
        enum: ['DRAFT', 'REVIEW', 'FINALIZED'],
        default: 'DRAFT'
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

// partial index for soft delete for duplicate city
ElectricityRateSchema.index(
    { city: 1 },
    {
        unique: true,
        partialFilterExpression: { isDeleted: false },
        collation: { locale: 'en', strength: 2 }
    }
);

export default mongoose.model<IElectricityRate>('ElectricityRate', ElectricityRateSchema); 