import { IPatientAccessLogRepository } from '../core/interfaces/IPatientAccessLog';

export class PatientAccessService {
  constructor(private accessLogRepo: IPatientAccessLogRepository) {}

  async logAccess(params: {
    staffId: string;
    staffRole: string;
    patientUserId: string;
    patientMongoId: string;
    accessType: 'view' | 'update' | 'create' | 'delete';
    accessedFields?: string[];
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
  }): Promise<void> {
    try {
      console.log('Attempting to log access:', params); // DEBUG LOG
      
      const result = await this.accessLogRepo.create({
        staffId: params.staffId,
        staffRole: params.staffRole,
        patientUserId: params.patientUserId,
        patientMongoId: params.patientMongoId,
        accessType: params.accessType,
        accessedFields: params.accessedFields,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        timestamp: new Date(),
        sessionId: params.sessionId,
      });
      
      console.log('Access log created successfully:', result); // DEBUG LOG
    } catch (error) {
      console.error('Error creating access log:', error); // DEBUG LOG
      // Don't throw error - we don't want to break the main flow if logging fails
    }
  }

  async getPatientAccessHistory(patientUserId: string) {
    return await this.accessLogRepo.findByPatientId(patientUserId);
  }

  async getStaffAccessHistory(staffId: string) {
    return await this.accessLogRepo.findByStaffId(staffId);
  }

  async getAccessLogsByDateRange(startDate: Date, endDate: Date) {
    return await this.accessLogRepo.findByDateRange(startDate, endDate);
  }

  async getAllAccessLogs() {
    return await this.accessLogRepo.findAll();
  }
}