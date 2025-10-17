import mongoose, { Schema, Document } from 'mongoose';

/**
 * Doctor Model - Inherits HospitalStaff
 * UC03 Methods: diagnosePatient(), prescribeMedication(), addConsultationNotes()
 */
export interface IDoctor extends Document {
  staffID: string;
  name: string;
  role: string;
  shift: string;
  specialization: string;
  licenseNumber: string;
  department?: string;

  diagnosePatient(patientID: string, diagnosis: string, recordID: string): Promise<any>;
  prescribeMedication(patientID: string, medication: string, recordID: string): Promise<any>;
  addConsultationNotes(recordID: string, notes: string): Promise<any>;
}

const DoctorSchema = new Schema({
  staffID: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  role: { type: String, default: 'DOCTOR' },
  shift: { type: String, required: true },
  specialization: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  department: { type: String, uppercase: true }
}, { timestamps: true });

DoctorSchema.methods.diagnosePatient = async function(
  patientID: string,
  diagnosis: string,
  recordID: string
): Promise<any> {
  if (!diagnosis || diagnosis.trim().length === 0) {
    throw new Error('Diagnosis required');
  }
  return {
    staffID: this.staffID,
    patientID,
    recordID,
    diagnosis,
    diagnosedAt: new Date(),
    notifyLabService: true
  };
};

DoctorSchema.methods.prescribeMedication = async function(
  patientID: string,
  medication: string,
  recordID: string
): Promise<any> {
  if (!medication || medication.trim().length === 0) {
    throw new Error('Medication required');
  }
  return {
    staffID: this.staffID,
    patientID,
    recordID,
    medication,
    prescribedAt: new Date()
  };
};

DoctorSchema.methods.addConsultationNotes = async function(
  recordID: string,
  notes: string
): Promise<any> {
  if (!notes || notes.trim().length === 0) {
    throw new Error('Notes required');
  }
  return {
    staffID: this.staffID,
    recordID,
    consultationNotes: notes,
    addedAt: new Date()
  };
};

export const Doctor = mongoose.model<IDoctor>('Doctor', DoctorSchema);