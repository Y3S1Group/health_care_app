import mongoose, { Schema, Document } from 'mongoose';

/**
 * Patient Model - UC03 Core Entity
 * Class Diagram Methods: registerAccount(), updateInfo(), viewMedicalRecord(),
 * makeAppointment(), rescheduleAppointment(), makePayment(), presentDigitalCard()
 */
export interface IPatient extends Document {
  patientID: string;
  name: string;
  gender: string;
  dateOfBirth: Date;
  email: string;
  phone: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCHARGED';

  registerAccount(): Promise<void>;
  updateInfo(data: any): Promise<void>;
  viewMedicalRecord(): Promise<any>;
  makeAppointment(appointmentData: any): Promise<any>;
  rescheduleAppointment(appointmentID: string, newDateTime: Date): Promise<any>;
  makePayment(amount: number, method: string): Promise<any>;
  presentDigitalCard(): Promise<any>;
}

const PatientSchema = new Schema({
  patientID: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'DISCHARGED'], default: 'ACTIVE' }
}, { timestamps: true });

PatientSchema.methods.registerAccount = async function(): Promise<void> {
  this.status = 'ACTIVE';
  await this.save();
};

PatientSchema.methods.updateInfo = async function(data: any): Promise<void> {
  const allowedFields = ['name', 'phone', 'email', 'address'];
  allowedFields.forEach(field => {
    if (data[field]) this[field] = data[field];
  });
  await this.save();
};

PatientSchema.methods.viewMedicalRecord = async function(): Promise<any> {
  return { patientID: this.patientID, name: this.name };
};

PatientSchema.methods.makeAppointment = async function(appointmentData: any): Promise<any> {
  if (!appointmentData.doctorID || !appointmentData.dateTime) {
    throw new Error('DoctorID and DateTime required');
  }
  return { patientID: this.patientID, ...appointmentData };
};

PatientSchema.methods.rescheduleAppointment = async function(
  appointmentID: string,
  newDateTime: Date
): Promise<any> {
  if (!appointmentID || !newDateTime) {
    throw new Error('AppointmentID and DateTime required');
  }
  return { patientID: this.patientID, appointmentID, newDateTime };
};

PatientSchema.methods.makePayment = async function(amount: number, method: string): Promise<any> {
  if (amount <= 0) throw new Error('Amount must be positive');
  return { patientID: this.patientID, amount, method, status: 'PENDING' };
};

PatientSchema.methods.presentDigitalCard = async function(): Promise<any> {
  return { patientID: this.patientID, cardID: `CARD-${this.patientID}` };
};

export const Patient = mongoose.model<IPatient>('Patient', PatientSchema);