import { IAppointmentRepository } from '../core/interfaces/IAppointmentRepository';
import { IPatientRepository } from '../core/interfaces/IPatientRepository';
import { IAuditService } from '../core/interfaces/IAuditService';
import { IAppointment } from '../models/Appointment';
import { ValidationError } from '../core/errors/ValidationError';

/**
 * AppointmentService - UC03 Appointment Management
 * SOLID: Single Responsibility - only handles appointment logic
 */
export class AppointmentService {
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private patientRepository: IPatientRepository,
    private auditService: IAuditService
  ) {}

  /**
   * Create appointment
   */
  async createAppointment(
    patientID: string,
    doctorID: string,
    dateTime: Date,
    staffID: string
  ): Promise<IAppointment> {
    try {
      // Verify patient exists
      const patient = await this.patientRepository.findByPatientID(patientID);
      if (!patient) {
        throw new ValidationError(`Patient ${patientID} not found`);
      }

      const appointmentData = {
        appointmentID: `APT-${Date.now()}`,
        patientID,
        doctorID,
        dateTime,
        status: 'SCHEDULED' as const
      };

      const appointment = await this.appointmentRepository.create(appointmentData);

      await this.auditService.log(
        staffID,
        'CREATE_APPOINTMENT',
        appointment.appointmentID,
        { patientID, doctorID, dateTime }
      );

      return appointment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reschedule appointment
   */
  async rescheduleAppointment(
  appointmentID: string,
  newDateTime: Date,
  staffID: string
): Promise<IAppointment> {
  try {
    const appointment = await this.appointmentRepository.findByAppointmentID(appointmentID);
    if (!appointment) {
      throw new ValidationError(`Appointment ${appointmentID} not found`);
    }

    const oldDateTime = appointment.dateTime;

    await appointment.rescheduleAppointment(newDateTime);

    await this.auditService.log(
      staffID,
      'RESCHEDULE_APPOINTMENT',
      appointmentID,
      { oldDateTime, newDateTime }
    );

    return appointment;
  } catch (error) {
    throw error;
  }
}


  /**
   * Cancel appointment
   */
  async cancelAppointment(
    appointmentID: string,
    staffID: string
  ): Promise<IAppointment> {
    try {
      const appointment = await this.appointmentRepository.findByAppointmentID(appointmentID);
      if (!appointment) {
        throw new ValidationError(`Appointment ${appointmentID} not found`);
      }

      await appointment.cancelAppointment();

      await this.auditService.log(
        staffID,
        'CANCEL_APPOINTMENT',
        appointmentID,
        { cancelledAt: new Date() }
      );

      return appointment;
    } catch (error) {
      throw error;
    }
  }
}