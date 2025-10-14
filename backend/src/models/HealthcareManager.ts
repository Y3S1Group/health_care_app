import { Schema, model, Document } from 'mongoose';

export interface IHealthcareManager extends Document {
    managerID: string;
    name: string;
}

const HealthcareManagerSchema = new Schema<IHealthcareManager>({
    managerID: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true }
});

export const HealthcareManager = model<IHealthcareManager>('HealthcareManager', HealthcareManagerSchema);