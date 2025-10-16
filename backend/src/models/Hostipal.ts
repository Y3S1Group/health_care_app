import mongoose, { Schema, Document } from 'mongoose';

export interface IHospital extends Document {
    hospitalID: string;
    name: string;
    location: string;
    type: string,

    registerHospital(): Promise<void>;
    manageDepartments(): Promise<any>;
    assignStaff(staffId: string): Promise<void>;
}

const HospitalSchema = new Schema<IHospital>({
    hospitalID: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }
}, { timestamps: true});

HospitalSchema.methods.registerHospital = async function(): Promise<void> {
    console.log(`[Hospital] Registering: ${this.name}`);
}


HospitalSchema.methods.manageDepartments = async function(): Promise<any> {
    return { hospitalID: this.hospitalID, departments: [] };
};

HospitalSchema.methods.assignStaff = async function(staffId: string): Promise<void> {
    console.log(`[Hospital] Assign staff ${staffId} to ${this.hospitalID}`);
}

export const Hospital = mongoose.model<IHospital>('Hosptial', HospitalSchema);