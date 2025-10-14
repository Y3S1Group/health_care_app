import { IHospitalStaff } from "../../models/HospitalStaff";

export interface IHospitalStaffRepository {
    findByIds(staffIds: string[]): Promise<IHospitalStaff[]>;
    findByDepartment(department: string): Promise<IHospitalStaff[]>;
    findAvailableStaff(department: string, limit: number): Promise<IHospitalStaff[]>;
}