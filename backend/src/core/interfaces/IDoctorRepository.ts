import { IDoctor } from '../../models/Doctor';

export interface IDoctorRepository {
  findByStaffID(staffID: string): Promise<IDoctor | null>;
  findAll(): Promise<IDoctor[]>;
  findBySpecialization(specialization: string): Promise<IDoctor[]>;
}