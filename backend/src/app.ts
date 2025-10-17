import express, { Application } from "express";
import cors from 'cors';
import { errorHandler } from "./middleware/errorHandler";
import { createResourceRoutes } from "./routes/resourceRoutes";
import { resourceController } from "./config/dependencies";
import { createStaffRoutes } from "./routes/staffRoutes";
import { createHospitalRoutes } from "./routes/hospitalRoutes";
import roleRoutes from './routes/roleRoutes';
import authRoutes from './routes/authRoutes';
import patientUpdateRoutes from './routes/patientUpdateRoutes';
import patientProfileRoutes from './routes/patientProfileRoutes';
import diagnosisRoutes from './routes/diagnosisRoutes';
import prescriptionRoutes from './routes/prescriptionRoutes';

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

app.use('/api/resources', createResourceRoutes(resourceController));
app.use('/api/staff', createStaffRoutes());
app.use('/api/hospitals', createHospitalRoutes());
app.use('/api', patientUpdateRoutes);

app.use('/api/roles', roleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/patient-profiles', patientProfileRoutes);
app.use('/api/diagnoses', diagnosisRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
