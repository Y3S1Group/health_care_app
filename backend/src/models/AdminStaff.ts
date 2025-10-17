import mongoose, { Schema, Document } from 'mongoose';

/**
 * AdminStaff Model - Inherits HospitalStaff
 * UC03 Methods: scheduleAppointment(), cancelAppointment(), processBilling()
 */
export interface IAdminStaff extends Document {
  staffID: string;
  name: string;
  role: string;
  shift: string;
  deskLocation: string;
  responsibilityArea: string;

  scheduleAppointment(patientID: string, appointmentData: any): Promise<any>;
  cancelAppointment(appointmentID: string, reason: string): Promise<any>;
  processBilling(paymentID: string, amount: number): Promise<any>;
}

const AdminStaffSchema = new Schema({
  staffID: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  role: { type: String, default: 'ADMIN' },
  shift: { type: String, required: true },
  deskLocation: { type: String, required: true },
  responsibilityArea: { type: String, required: true }
}, { timestamps: true });

AdminStaffSchema.methods.scheduleAppointment = async function(
  patientID: string,
  appointmentData: any
): Promise<any> {
  if (!patientID || !appointmentData.doctorID || !appointmentData.dateTime) {
    throw new Error('PatientID, DoctorID, DateTime required');
  }
  return {
    staffID: this.staffID,
    patientID,
    ...appointmentData,
    status: 'SCHEDULED',
    scheduledAt: new Date()
  };
};

AdminStaffSchema.methods.cancelAppointment = async function(
  appointmentID: string,
  reason: string
): Promise<any> {
  if (!appointmentID) throw new Error('AppointmentID required');
  return {
    staffID: this.staffID,
    appointmentID,
    status: 'CANCELLED',
    reason,
    cancelledAt: new Date()
  };
};

AdminStaffSchema.methods.processBilling = async function(
  paymentID: string,
  amount: number
): Promise<any> {
  if (!paymentID || amount <= 0) {
    throw new Error('Valid PaymentID and positive amount required');
  }
  return {
    staffID: this.staffID,
    paymentID,
    amount,
    status: 'PROCESSING',
    syncWithBillingService: true,
    processedAt: new Date()
  };
};

export const AdminStaff = mongoose.model<IAdminStaff>('AdminStaff', AdminStaffSchema);