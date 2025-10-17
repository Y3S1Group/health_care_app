import { IMedicalRecord } from '../../models/MedicalRecord';

export interface IMedicalRecordRepository {
  create(data: Partial<IMedicalRecord>): Promise<IMedicalRecord>;
  findByRecordID(recordID: string): Promise<IMedicalRecord | null>;
  findByPatientID(patientID: string): Promise<IMedicalRecord[]>;
  update(recordID: string, data: Partial<IMedicalRecord>): Promise<IMedicalRecord>;
}