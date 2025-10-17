import { IResourceRepository } from '../core/interfaces/IResourceRepository';
import { Resource, IResource } from '../models/Resource';

export class ResourceRepository implements IResourceRepository {
  async findByDepartment(department: string): Promise<IResource | null> {
    return await Resource.findOne({ department });
  }

  async findAll(): Promise<IResource[]> {
    return await Resource.find();
  }

  async createOrUpdate(department: string, data: Partial<IResource>): Promise<IResource> {
    const existing = await this.findByDepartment(department);
    
    if (existing) {
      Object.assign(existing, data);
      return await existing.save();
    }
    
    const resource = new Resource({
      department,
      ...data
    });
    return await resource.save();
  }
}
