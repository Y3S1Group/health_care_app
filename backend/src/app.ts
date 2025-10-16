import express, { Application } from "express";
import cors from 'cors';
import { errorHandler } from "./middleware/errorHandler";
import { createResourceRoutes } from "./routes/resourceRoutes";
import { resourceController } from "./config/dependencies";
import { createStaffRoutes } from "./routes/staffRoutes";
import { createHospitalRoutes } from "./routes/hospitalRoutes";

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

app.use('/api/resources', createResourceRoutes(resourceController));
app.use('/api/staff', createStaffRoutes());
app.use('/api/hospitals', createHospitalRoutes());

app.use(errorHandler);

export default app;