import mongoose from "mongoose";
import { logger } from "./logger";


export const connectDB = async (): Promise<void>  => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI environment variable is not set');
        }

        await mongoose.connect(mongoUri);
        logger.info('MongoDB connected successfully');
    } catch (err: any) {
        logger.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
}