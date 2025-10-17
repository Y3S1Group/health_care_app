import { IAdminStaff } from '../../models/AdminStaff';

export interface IAdminStaffRepository {
  findByStaffID(staffID: string): Promise<IAdminStaff | null>;
  findAll(): Promise<IAdminStaff[]>;
}