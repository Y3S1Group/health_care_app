import { IAppointment } from '../../models/Appointment';

export interface IAppointmentRepository {
  create(data: Partial<IAppointment>): Promise<IAppointment>;
  findByAppointmentID(appointmentID: string): Promise<IAppointment | null>;
  findByPatientID(patientID: string): Promise<IAppointment[]>;
  update(appointmentID: string, data: Partial<IAppointment>): Promise<IAppointment>;
  delete(appointmentID: string): Promise<boolean>;
}