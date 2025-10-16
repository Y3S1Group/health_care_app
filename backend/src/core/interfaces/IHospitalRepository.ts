import { IHospital } from "../../models/Hostipal";

export interface IHospitalRepository {
  findByHospitalID(hospitalID: string): Promise<IHospital | null>;
  create(data: Partial<IHospital>): Promise<IHospital>;
  findAll(): Promise<IHospital[]>;
}