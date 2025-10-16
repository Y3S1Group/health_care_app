import { IHospitalRepository } from "../core/interfaces/IHospitalRepository";
import { HospitalStaff, IHospitalStaff } from "../models/HospitalStaff";
import { Hospital, IHospital } from "../models/Hostipal";

export class HospitalRepository implements IHospitalRepository {
  async findByHospitalID(hospitalID: string): Promise<IHospital | null> {
    return await Hospital.findOne({ hospitalID });
  }

  async create(data: Partial<IHospital>): Promise<IHospital> {
    const hospital = new Hospital(data);
    return await hospital.save();
  }

  async findAll(): Promise<IHospital[]> {
    return await Hospital.find();
  }

  async findByIds(staffIds: string[]): Promise<IHospitalStaff[]> {
    if (staffIds.length === 0) {
      return await HospitalStaff.find();
    }
    return await HospitalStaff.find({ staffID: { $in: staffIds } });
  }
}
