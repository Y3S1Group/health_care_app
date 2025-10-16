import { IRoleRepository, IRole } from '../core/interfaces/IRoleRepository';
import { RoleModel, IRoleDocument } from '../models/Role';

export class RoleRepository implements IRoleRepository {
  async findByName(name: string): Promise<IRole | null> {
    const role = await RoleModel.findOne({ name: name.toLowerCase() }).lean().exec();
    if (!role) return null;
    
    return {
      _id: role._id.toString(),
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  async findById(id: string): Promise<IRole | null> {
    const role = await RoleModel.findById(id).lean().exec();
    if (!role) return null;
    
    return {
      _id: role._id.toString(),
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  async create(role: Partial<IRole>): Promise<IRole> {
    const doc: IRoleDocument = await RoleModel.create(role);
    
    return {
      _id: (doc._id as any).toString(),
      name: doc.name,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findAll(): Promise<IRole[]> {
    const roles = await RoleModel.find().lean().exec();
    
    return roles.map(role => ({
      _id: role._id.toString(),
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));
  }
}