import { INurseRepository } from '../core/interfaces/INurseRepository';
import { Nurse, INurse } from '../models/Nurse';

export class NurseRepository implements INurseRepository {
  async findByStaffID(staffID: string): Promise<INurse | null> {
    return await Nurse.findOne({ staffID });
  }

  async findByDepartment(department: string): Promise<INurse[]> {
    return await Nurse.find({ department });
  }

  async findAll(): Promise<INurse[]> {
    return await Nurse.find();
  }
}