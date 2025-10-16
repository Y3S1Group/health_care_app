import { IHospitalStaff } from "../../models/HospitalStaff";

export interface IHospitalStaffRepository {
    findByIds(staffIds: string[]): Promise<IHospitalStaff[]>;
    findAvailableStaff(department: string, count: number): Promise<IHospitalStaff[]>;
    findByDepartment(department: string): Promise<IHospitalStaff[]>;
}