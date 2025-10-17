import { IAppointmentRepository } from '../core/interfaces/IAppointmentRepository';
import { Appointment, IAppointment } from '../models/Appointment';
import { NotFoundError } from '../core/errors/NotFoundError';

export class AppointmentRepository implements IAppointmentRepository {
  async create(data: Partial<IAppointment>): Promise<IAppointment> {
    const appointment = new Appointment(data);
    return await appointment.save();
  }

  async findByAppointmentID(appointmentID: string): Promise<IAppointment | null> {
    return await Appointment.findOne({ appointmentID });
  }

  async findByPatientID(patientID: string): Promise<IAppointment[]> {
    return await Appointment.find({ patientID }).sort({ dateTime: -1 });
  }

  async update(appointmentID: string, data: Partial<IAppointment>): Promise<IAppointment> {
    const appointment = await Appointment.findOneAndUpdate({ appointmentID }, data, {
      new: true,
      runValidators: true
    });
    if (!appointment) throw new NotFoundError('Appointment');
    return appointment;
  }

  async delete(appointmentID: string): Promise<boolean> {
    const result = await Appointment.deleteOne({ appointmentID });
    return result.deletedCount > 0;
  }
}