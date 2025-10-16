import express, { Application } from "express";
import cors from 'cors';

// Import routes
import roleRoutes from './routes/roleRoutes';
import authRoutes from './routes/authRoutes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/roles', roleRoutes);
app.use('/api/auth', authRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;