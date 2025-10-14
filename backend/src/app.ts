import express, { Application } from "express";
import cors from 'cors';

const app: Application = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173/'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// app.use('/api/resources', resourceRoutes);

// app.use(errorHandler);

export default app;