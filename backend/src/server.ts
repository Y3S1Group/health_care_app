import app from './app';
import { connectDB } from './config/db';
import { logger } from './config/logger';
import dotenv from 'dotenv';

dotenv.config();

const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || '5009';
        app.listen(parseInt(PORT), () => {
            logger.info(`server running on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        })
    } catch (error: any) {
        logger.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();