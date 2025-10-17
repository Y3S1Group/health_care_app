import mongoose, { Schema, Document } from 'mongoose';

/**
 * Nurse Model - Inherits HospitalStaff
 * UC03 Methods: assistTreatment(), updateVitalSigns(), markAttendance()
 * Alternate Flow A2: Detects abnormalities and alerts doctor
 */
export interface INurse extends Document {
  staffID: string;
  name: string;
  role: string;
  shift: string;
  certification: string;
  department: string;

  assistTreatment(patientID: string, treatmentData: any, recordID: string): Promise<any>;
  updateVitalSigns(recordID: string, vitals: any): Promise<any>;
  markAttendance(patientID: string, status: string): Promise<any>;
}

const NurseSchema = new Schema({
  staffID: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  role: { type: String, default: 'NURSE' },
  shift: { type: String, required: true },
  certification: { type: String, required: true },
  department: { type: String, required: true, uppercase: true }
}, { timestamps: true });

NurseSchema.methods.assistTreatment = async function(
  patientID: string,
  treatmentData: any,
  recordID: string
): Promise<any> {
  if (!treatmentData) throw new Error('Treatment data required');
  return {
    staffID: this.staffID,
    patientID,
    recordID,
    treatment: treatmentData,
    assistedAt: new Date()
  };
};

NurseSchema.methods.updateVitalSigns = async function(
  recordID: string,
  vitals: any
): Promise<any> {
  if (!vitals || !vitals.temperature || !vitals.bloodPressure || !vitals.heartRate) {
    throw new Error('Complete vital signs required');
  }
  
  // Check for abnormalities - Alternate Flow A2
  const hasAbnormalities = vitals.temperature < 36.5 || vitals.temperature > 37.5 ||
    vitals.heartRate < 60 || vitals.heartRate > 100;

  return {
    staffID: this.staffID,
    recordID,
    vitals,
    updatedAt: new Date(),
    hasAbnormalities,
    alertDoctor: hasAbnormalities
  };
};

NurseSchema.methods.markAttendance = async function(
  patientID: string,
  status: string
): Promise<any> {
  const validStatuses = ['PRESENT', 'ABSENT', 'LATE'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Valid: ${validStatuses.join(', ')}`);
  }
  return {
    staffID: this.staffID,
    patientID,
    status,
    markedAt: new Date()
  };
};

export const Nurse = mongoose.model<INurse>('Nurse', NurseSchema);