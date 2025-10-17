import mongoose, { Schema, Document } from 'mongoose';

/**
 * Appointment Model - UC03 Core Entity
 * Class Diagram Methods: createAppointment(), rescheduleAppointment(),
 * cancelAppointment(), markAttendance()
 */
export interface IAppointment extends Document {
  appointmentID: string;
  patientID: string;
  doctorID: string;
  dateTime: Date;
  status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

  createAppointment(): Promise<void>;
  rescheduleAppointment(newDateTime: Date): Promise<void>;
  cancelAppointment(): Promise<void>;
  markAttendance(status: string): Promise<void>;
}

const AppointmentSchema = new Schema({
  appointmentID: { type: String, required: true, unique: true, uppercase: true },
  patientID: { type: String, required: true, uppercase: true },
  doctorID: { type: String, required: true, uppercase: true },
  dateTime: { type: Date, required: true },
  status: { type: String, enum: ['SCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'], default: 'SCHEDULED' }
}, { timestamps: true });

AppointmentSchema.methods.createAppointment = async function(): Promise<void> {
  this.status = 'SCHEDULED';
  await this.save();
};

AppointmentSchema.methods.rescheduleAppointment = async function(newDateTime: Date): Promise<void> {
  if (!newDateTime || newDateTime <= new Date()) {
    throw new Error('Valid future date required');
  }
  this.dateTime = newDateTime;
  await this.save();
};

AppointmentSchema.methods.cancelAppointment = async function(): Promise<void> {
  if (this.status === 'COMPLETED' || this.status === 'CANCELLED') {
    throw new Error(`Cannot cancel ${this.status} appointment`);
  }
  this.status = 'CANCELLED';
  await this.save();
};

AppointmentSchema.methods.markAttendance = async function(status: string): Promise<void> {
  const validStatuses = ['COMPLETED', 'NO_SHOW'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  this.status = status;
  await this.save();
};

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);