import { IMedicalRecordRepository } from '../core/interfaces/IMedicalRecordRepository';
import { MedicalRecord, IMedicalRecord } from '../models/MedicalRecord';
import { NotFoundError } from '../core/errors/NotFoundError';

export class MedicalRecordRepository implements IMedicalRecordRepository {
  async create(data: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
    const record = new MedicalRecord(data);
    return await record.save();
  }

  async findByRecordID(recordID: string): Promise<IMedicalRecord | null> {
    return await MedicalRecord.findOne({ recordID });
  }

  async findByPatientID(patientID: string): Promise<IMedicalRecord[]> {
    return await MedicalRecord.find({ patientID }).sort({ dateCreated: -1 });
  }

  async update(recordID: string, data: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
    const record = await MedicalRecord.findOneAndUpdate({ recordID }, data, {
      new: true,
      runValidators: true
    });
    if (!record) throw new NotFoundError('MedicalRecord');
    return record;
  }
}