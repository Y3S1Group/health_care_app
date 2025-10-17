import { IDoctorRepository } from '../core/interfaces/IDoctorRepository';
import { Doctor, IDoctor } from '../models/Doctor';

export class DoctorRepository implements IDoctorRepository {
  async findByStaffID(staffID: string): Promise<IDoctor | null> {
    return await Doctor.findOne({ staffID });
  }

  async findAll(): Promise<IDoctor[]> {
    return await Doctor.find();
  }

  async findBySpecialization(specialization: string): Promise<IDoctor[]> {
    return await Doctor.find({ specialization });
  }
}