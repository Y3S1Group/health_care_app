import { IHealthcareManagerRepository } from '../core/interfaces/IHealthcareManagerRepository';
import { HealthcareManager, IHealthcareManager } from '../models/HealthcareManager';

export class HealthcareManagerRepository implements IHealthcareManagerRepository {
  async findByManagerID(managerID: string): Promise<IHealthcareManager | null> {
    return await HealthcareManager.findOne({ managerID });
  }

  async create(data: Partial<IHealthcareManager>): Promise<IHealthcareManager> {
    const manager = new HealthcareManager(data);
    return await manager.save();
  }

  async findAll(): Promise<IHealthcareManager[]> {
    return await HealthcareManager.find();
  }
}