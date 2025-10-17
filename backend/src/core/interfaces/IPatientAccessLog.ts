export interface IPatientAccessLog {
  _id?: string;
  staffId: string;
  staffRole: string;
  patientUserId: string;
  patientMongoId: string;
  accessType: 'view' | 'update' | 'create' | 'delete';
  accessedFields?: string[];
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  sessionId?: string;
}

export interface IPatientAccessLogRepository {
  create(log: Partial<IPatientAccessLog>): Promise<IPatientAccessLog>;
  findByPatientId(patientUserId: string): Promise<IPatientAccessLog[]>;
  findByStaffId(staffId: string): Promise<IPatientAccessLog[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<IPatientAccessLog[]>;
  findAll(): Promise<IPatientAccessLog[]>;
}