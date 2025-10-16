import { IHealthcareManager } from "../../models/HealthcareManager";

export interface IHealthcareManagerRepository {
  findByManagerID(managerID: string): Promise<IHealthcareManager | null>;
  create(data: Partial<IHealthcareManager>): Promise<IHealthcareManager>;
  findAll(): Promise<IHealthcareManager[]>;
}