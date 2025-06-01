import mongoose, { Schema, Document } from 'mongoose';

export interface ISolarRadiation extends Document {
    name: string;
    city: string;
    radiation: {
        north: number;
        south: number;
        east: number;
        west: number;
        roof: number;
    };
    unit: string;
    status: 'DRAFT' | 'REVIEW' | 'FINALIZED' | 'REJECTED';
    isActive: boolean;
    isDeleted: boolean;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SolarRadiationSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100,
    },
    city: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100,
        validate: {
            validator: function (v: string) {
                return v.trim().length > 0;
            },
            message: 'City name cannot be empty'
        }
    },
    radiation: {
        north: {
            type: Number,
            required: true,
            min: 0
        },
        south: {
            type: Number,
            required: true,
            min: 0
        },
        east: {
            type: Number,
            required: true,
            min: 0
        },
        west: {
            type: Number,
            required: true,
            min: 0
        },
        roof: {
            type: Number,
            required: true,
            min: 0
        }
    },
    unit: {
        type: String,
        required: true,
        default: 'kWh/m²/day'
    },
    status: {
        type: String,
        required: true,
        enum: ['DRAFT', 'REVIEW', 'FINALIZED', 'REJECTED'],
        default: 'DRAFT'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

SolarRadiationSchema.index(
    { city: 1 },
    {
        unique: true,
        partialFilterExpression: { isDeleted: false },
        collation: { locale: 'en', strength: 2 }
    }
);

export default mongoose.model<ISolarRadiation>('SolarRadiation', SolarRadiationSchema); 