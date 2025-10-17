import { IPatientRepository } from '../core/interfaces/IPatientRepository';
import { Patient, IPatient } from '../models/Patient';
import { NotFoundError } from '../core/errors/NotFoundError';

export class PatientRepository implements IPatientRepository {
  async create(data: Partial<IPatient>): Promise<IPatient> {
    const patient = new Patient(data);
    return await patient.save();
  }

  async findByPatientID(patientID: string): Promise<IPatient | null> {
    return await Patient.findOne({ patientID });
  }

  async findAll(): Promise<IPatient[]> {
    return await Patient.find().sort({ createdAt: -1 });
  }

  async update(patientID: string, data: Partial<IPatient>): Promise<IPatient> {
    const patient = await Patient.findOneAndUpdate({ patientID }, data, {
      new: true,
      runValidators: true
    });
    if (!patient) throw new NotFoundError('Patient');
    return patient;
  }
}