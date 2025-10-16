import { IHospitalStaffRepository } from "../core/interfaces/IHospitalStaffRepository";
import { HospitalStaff, IHospitalStaff } from "../models/HospitalStaff";

export class HospitalStaffRepository implements IHospitalStaffRepository {
  async findByIds(staffIds: string[]): Promise<IHospitalStaff[]> {
    return await HospitalStaff.find({ staffID: { $in: staffIds } });
  }

  async findAvailableStaff(department: string, count: number): Promise<IHospitalStaff[]> {
    return await HospitalStaff.find({ department }).limit(count);
  }

  async findByDepartment(department: string): Promise<IHospitalStaff[]> {
    return await HospitalStaff.find({ department });
  }
}
