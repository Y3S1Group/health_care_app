import { 
  IPatientAccessLog, 
  IPatientAccessLogRepository 
} from '../core/interfaces/IPatientAccessLog';
import { 
  PatientAccessLogModel, 
  IPatientAccessLogDocument 
} from '../models/PatientAccessLog';

export class PatientAccessLogRepository implements IPatientAccessLogRepository {
  async create(log: Partial<IPatientAccessLog>): Promise<IPatientAccessLog> {
    const doc = await PatientAccessLogModel.create(log);
    return this.mapToInterface(doc);
  }

  async findByPatientId(patientUserId: string): Promise<IPatientAccessLog[]> {
    const logs = await PatientAccessLogModel.find({ patientUserId })
      .sort({ timestamp: -1 })
      .lean()
      .exec();
    return logs.map(log => this.mapToInterface(log));
  }

  async findByStaffId(staffId: string): Promise<IPatientAccessLog[]> {
    const logs = await PatientAccessLogModel.find({ staffId })
      .sort({ timestamp: -1 })
      .lean()
      .exec();
    return logs.map(log => this.mapToInterface(log));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<IPatientAccessLog[]> {
    const logs = await PatientAccessLogModel.find({
      timestamp: { $gte: startDate, $lte: endDate }
    })
      .sort({ timestamp: -1 })
      .lean()
      .exec();
    return logs.map(log => this.mapToInterface(log));
  }

  async findAll(): Promise<IPatientAccessLog[]> {
    const logs = await PatientAccessLogModel.find()
      .sort({ timestamp: -1 })
      .lean()
      .exec();
    return logs.map(log => this.mapToInterface(log));
  }

  private mapToInterface(doc: any): IPatientAccessLog {
    return {
      _id: doc._id?.toString(),
      staffId: doc.staffId,
      staffRole: doc.staffRole,
      patientUserId: doc.patientUserId,
      patientMongoId: doc.patientMongoId?.toString(),
      accessType: doc.accessType,
      accessedFields: doc.accessedFields,
      ipAddress: doc.ipAddress,
      userAgent: doc.userAgent,
      timestamp: doc.timestamp,
      sessionId: doc.sessionId,
    };
  }
}