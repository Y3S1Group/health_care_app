import { INurse } from '../../models/Nurse';

export interface INurseRepository {
  findByStaffID(staffID: string): Promise<INurse | null>;
  findByDepartment(department: string): Promise<INurse[]>;
  findAll(): Promise<INurse[]>;
}