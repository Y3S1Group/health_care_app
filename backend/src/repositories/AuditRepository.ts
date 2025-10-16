import { AuditLog, IAuditLog } from '../models/AuditLog';

export class AuditRepository {
  async create(data: Partial<IAuditLog>): Promise<IAuditLog> {
    const log = new AuditLog(data);
    return await log.save();
  }

  async findAll(): Promise<IAuditLog[]> {
    return await AuditLog.find().sort({ timestamp: -1 });
  }
}