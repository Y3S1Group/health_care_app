import { IPatient } from '../../models/Patient';

export interface IPatientRepository {
  create(data: Partial<IPatient>): Promise<IPatient>;
  findByPatientID(patientID: string): Promise<IPatient | null>;
  findAll(): Promise<IPatient[]>;
  update(patientID: string, data: Partial<IPatient>): Promise<IPatient>;
}