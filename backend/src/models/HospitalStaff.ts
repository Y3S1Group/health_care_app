import { Schema, model, Document } from 'mongoose';

export enum StaffRole {
     DOCTOR = 'Doctor',
     NURSE = 'Nurse',
     ADMIN_STAFF = 'AdminStaff'
}

export interface IHospitalStaff extends Document {
    staffID: string;
    name: string;
    role: StaffRole;
    shift?: string;
    department: string;
    createdAt: Date;
}

const HospitalStaffSchema = new Schema<IHospitalStaff>({
    staffID: { type: String, required: true, unique: true, uppercade: true },
    name : { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(StaffRole) },
    shift: { type: String },
    department: { type: String, required: true, uppercase: true },
    createdAt: { type: Date, default: Date.now }
});

HospitalStaffSchema.index({ department: 1, role: 1 });

export const HospitalStaff = model<IHospitalStaff>('HospitalStaff', HospitalStaffSchema);