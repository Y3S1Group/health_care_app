import mongoose, { Schema, model, Document, mongo } from 'mongoose';

export interface IHospitalStaff extends Document {
    staffID: string;
    name: string;
    role: string;
    shift?: string;
    department: string;

    login(): Promise<any>;
    updateProfile(data: any): Promise<void>;
    accessPatientRecord(recordId: string): Promise<any>;
    managePatientRecord(recordId: string, data: any): Promise<void>;
}

const HospitalStaffSchema = new Schema<IHospitalStaff>({
    staffID: { type: String, required: true, unique: true, uppercade: true },
    name : { type: String, required: true },
    role: { type: String, required: true },
    shift: { type: String },
    department: { type: String, required: true, uppercase: true }
});

HospitalStaffSchema.methods.login = async function(): Promise<any> {
  return { staffID: this.staffID, name: this.name, role: this.role };
};

HospitalStaffSchema.methods.updateProfile = async function(data: any): Promise<void> {
  Object.assign(this, data);
  await this.save();
};

HospitalStaffSchema.methods.accessPatientRecord = async function(recordId: string): Promise<any> {
  return { recordId, accessed: true };
};

HospitalStaffSchema.methods.managePatientRecord = async function(recordId: string, data: any): Promise<void> {
  console.log(`[Staff] ${this.staffID} managing record ${recordId}`);
};


export const HospitalStaff = mongoose.model<IHospitalStaff>('HospitalStaff', HospitalStaffSchema);

