// tests/AppointmentService.test.ts
import { AppointmentService } from '../../src/services/AppointmentService';
import { ValidationError } from '../../src/core/errors/ValidationError'; // adjust path if needed

// Minimal interface types for test clarity (only the bits used by service)
type IAppointment = {
  appointmentID: string;
  patientID: string;
  doctorID: string;
  dateTime: Date;
  status: 'SCHEDULED' | 'CANCELLED' | string;
  rescheduleAppointment?: (newDate: Date) => Promise<void>;
  cancelAppointment?: () => Promise<void>;
};

describe('AppointmentService', () => {
  let appointmentRepo: any;
  let patientRepo: any;
  let auditSvc: any;
  let svc: AppointmentService;

  beforeEach(() => {
    appointmentRepo = {
      create: jest.fn(),
      findByAppointmentID: jest.fn()
    };
    patientRepo = {
      findByPatientID: jest.fn()
    };
    auditSvc = {
      log: jest.fn()
    };

    svc = new AppointmentService(appointmentRepo, patientRepo, auditSvc);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createAppointment', () => {
    it('creates appointment when patient exists and logs audit (positive)', async () => {
      // Arrange
      const patientID = 'PAT-1';
      const doctorID = 'DOC-1';
      const staffID = 'STF-1';
      const dateTime = new Date('2025-10-20T10:00:00Z');

      patientRepo.findByPatientID.mockResolvedValue({ patientID });

      // Make Date.now deterministic
      jest.spyOn(Date, 'now').mockReturnValue(1697779200000); // fixed ms
      const expectedAppointmentID = `APT-${1697779200000}`;

      const createdAppointment: IAppointment = {
        appointmentID: expectedAppointmentID,
        patientID,
        doctorID,
        dateTime,
        status: 'SCHEDULED'
      };

      appointmentRepo.create.mockResolvedValue(createdAppointment);

      // Act
      const result = await svc.createAppointment(patientID, doctorID, dateTime, staffID);

      // Assert
      expect(patientRepo.findByPatientID).toHaveBeenCalledWith(patientID);
      expect(appointmentRepo.create).toHaveBeenCalledTimes(1);

      // Check that create was called with an object containing fields we expect
      const createArg = appointmentRepo.create.mock.calls[0][0];
      expect(createArg.patientID).toBe(patientID);
      expect(createArg.doctorID).toBe(doctorID);
      expect(createArg.status).toBe('SCHEDULED');
      expect(createArg.appointmentID).toBe(expectedAppointmentID);
      expect(createArg.dateTime).toBe(dateTime);

      expect(auditSvc.log).toHaveBeenCalledWith(
        staffID,
        'CREATE_APPOINTMENT',
        expectedAppointmentID,
        { patientID, doctorID, dateTime }
      );

      expect(result).toBe(createdAppointment);
    });

    it('throws ValidationError when patient not found (negative)', async () => {
      patientRepo.findByPatientID.mockResolvedValue(null);

      await expect(
        svc.createAppointment('missing-pat', 'doc', new Date(), 'staff')
      ).rejects.toThrow(ValidationError);

      expect(appointmentRepo.create).not.toHaveBeenCalled();
      expect(auditSvc.log).not.toHaveBeenCalled();
    });

    it('propagates repository errors (error case)', async () => {
      const patientID = 'PAT-2';
      patientRepo.findByPatientID.mockResolvedValue({ patientID });
      appointmentRepo.create.mockRejectedValue(new Error('DB down'));

      await expect(
        svc.createAppointment(patientID, 'doc', new Date(), 'staff')
      ).rejects.toThrow('DB down');

      expect(auditSvc.log).not.toHaveBeenCalled();
    });
  });

  describe('rescheduleAppointment', () => {
    it('reschedules existing appointment and logs audit (positive)', async () => {
      const appointmentID = 'APT-123';
      const oldDate = new Date('2025-10-20T09:00:00Z');
      const newDate = new Date('2025-10-21T11:00:00Z');
      const staffID = 'STF-9';

      // Mock appointment object with rescheduleAppointment method that updates dateTime
      const appointment: IAppointment = {
        appointmentID,
        patientID: 'PAT-9',
        doctorID: 'DOC-9',
        dateTime: oldDate,
        status: 'SCHEDULED',
        rescheduleAppointment: jest.fn(async (d: Date) => {
          appointment.dateTime = d;
        })
      };

      appointmentRepo.findByAppointmentID.mockResolvedValue(appointment);

      // Act
      const result = await svc.rescheduleAppointment(appointmentID, newDate, staffID);

      // Assert
      expect(appointmentRepo.findByAppointmentID).toHaveBeenCalledWith(appointmentID);
      expect(appointment.rescheduleAppointment).toHaveBeenCalledWith(newDate);

      expect(auditSvc.log).toHaveBeenCalledWith(
        staffID,
        'RESCHEDULE_APPOINTMENT',
        appointmentID,
        { oldDateTime: oldDate, newDateTime: newDate }
      );

      // ensure appointment object's dateTime updated by reschedule
      expect(result.dateTime).toBe(newDate);
    });

    it('throws ValidationError when appointment not found (negative)', async () => {
      appointmentRepo.findByAppointmentID.mockResolvedValue(null);

      await expect(
        svc.rescheduleAppointment('non-existent', new Date(), 'staff')
      ).rejects.toThrow(ValidationError);

      expect(auditSvc.log).not.toHaveBeenCalled();
    });

    it('propagates error if appointment.rescheduleAppointment throws (error case)', async () => {
      const appointmentID = 'APT-ERR';
      const appointment: any = {
        appointmentID,
        dateTime: new Date(),
        rescheduleAppointment: jest.fn().mockRejectedValue(new Error('invalid date'))
      };
      appointmentRepo.findByAppointmentID.mockResolvedValue(appointment);

      await expect(
        svc.rescheduleAppointment(appointmentID, new Date('invalid'), 'staff')
      ).rejects.toThrow('invalid date');

      expect(auditSvc.log).not.toHaveBeenCalled(); // because reschedule failed
    });
  });

  describe('cancelAppointment', () => {
    it('cancels existing appointment and logs audit (positive)', async () => {
      const appointmentID = 'APT-555';
      const staffID = 'STAFF-A';
      const appointment: any = {
        appointmentID,
        dateTime: new Date('2025-10-22T12:00:00Z'),
        cancelAppointment: jest.fn(async () => {
          appointment.status = 'CANCELLED';
        })
      };
      appointmentRepo.findByAppointmentID.mockResolvedValue(appointment);

      const beforeCall = Date.now();
      // Act
      const result = await svc.cancelAppointment(appointmentID, staffID);

      // Assert
      expect(appointmentRepo.findByAppointmentID).toHaveBeenCalledWith(appointmentID);
      expect(appointment.cancelAppointment).toHaveBeenCalled();

      // audit log should include cancelledAt - assert it's a Date and >= beforeCall (ms)
      const auditCall = auditSvc.log.mock.calls[0];
      expect(auditCall[0]).toBe(staffID);
      expect(auditCall[1]).toBe('CANCEL_APPOINTMENT');
      expect(auditCall[2]).toBe(appointmentID);
      const auditPayload = auditCall[3] as any;
      expect(auditPayload).toHaveProperty('cancelledAt');
      expect(auditPayload.cancelledAt instanceof Date).toBe(true);
      expect(auditPayload.cancelledAt.getTime()).toBeGreaterThanOrEqual(beforeCall);

      // appointment object status updated by mocked cancel
      expect(result.status).toBe('CANCELLED');
    });

    it('throws ValidationError when appointment not found (negative)', async () => {
      appointmentRepo.findByAppointmentID.mockResolvedValue(null);

      await expect(svc.cancelAppointment('nope', 'staff')).rejects.toThrow(ValidationError);
      expect(auditSvc.log).not.toHaveBeenCalled();
    });

    it('propagates error if cancelAppointment throws (error case)', async () => {
      const appointmentID = 'APT-ERR-CANCEL';
      const appointment: any = {
        appointmentID,
        dateTime: new Date(),
        cancelAppointment: jest.fn().mockRejectedValue(new Error('cannot cancel'))
      };
      appointmentRepo.findByAppointmentID.mockResolvedValue(appointment);

      await expect(svc.cancelAppointment(appointmentID, 'staff')).rejects.toThrow('cannot cancel');
      expect(auditSvc.log).not.toHaveBeenCalled();
    });
  });
});
