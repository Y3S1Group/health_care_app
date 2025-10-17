import mongoose, { Schema, Document } from 'mongoose';

/**
 * MedicalRecord Model - UC03 Core Entity
 * Class Diagram Methods: addConsultationNote(), updateRecord(), viewRecord()
 */
export interface IMedicalRecord extends Document {
  recordID: string;
  patientID: string;
  staffID?: string;
  diagnosis: string;
  prescription: string;
  consultationNotes: string;
  dateCreated: Date;
  lastUpdated: Date;

  addConsultationNote(note: string): Promise<void>;
  updateRecord(data: any): Promise<void>;
  viewRecord(): Promise<any>;
}

const MedicalRecordSchema = new Schema({
  recordID: { type: String, required: true, unique: true, uppercase: true },
  patientID: { type: String, required: true, uppercase: true },
  staffID: { type: String, uppercase: true },
  diagnosis: { type: String, default: '' },
  prescription: { type: String, default: '' },
  consultationNotes: { type: String, default: '' },
  dateCreated: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

MedicalRecordSchema.methods.addConsultationNote = async function(note: string): Promise<void> {
  if (!note || note.trim().length === 0) {
    throw new Error('Note cannot be empty');
  }
  this.consultationNotes = note;
  this.lastUpdated = new Date();
  await this.save();
};

MedicalRecordSchema.methods.updateRecord = async function(data: any): Promise<void> {
  if (!data) throw new Error('Data required');
  const allowedFields = ['diagnosis', 'prescription', 'consultationNotes'];
  allowedFields.forEach(field => {
    if (data[field] !== undefined) this[field] = data[field];
  });
  this.lastUpdated = new Date();
  await this.save();
};

MedicalRecordSchema.methods.viewRecord = async function(): Promise<any> {
  return {
    recordID: this.recordID,
    patientID: this.patientID,
    diagnosis: this.diagnosis,
    prescription: this.prescription,
    consultationNotes: this.consultationNotes,
    dateCreated: this.dateCreated,
    lastUpdated: this.lastUpdated
  };
};

export const MedicalRecord = mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);