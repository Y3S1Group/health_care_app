import { IAdminStaffRepository } from '../core/interfaces/IAdminStaffRepository';
import { AdminStaff, IAdminStaff } from '../models/AdminStaff';

export class AdminStaffRepository implements IAdminStaffRepository {
  async findByStaffID(staffID: string): Promise<IAdminStaff | null> {
    return await AdminStaff.findOne({ staffID });
  }

  async findAll(): Promise<IAdminStaff[]> {
    return await AdminStaff.find();
  }
}