import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ENV_VARIABLES } from '../utils/constants';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV_VARIABLES.MONGO_URI as string);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};
