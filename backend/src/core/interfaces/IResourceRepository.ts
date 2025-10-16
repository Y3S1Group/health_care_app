import { IResource } from "../../models/Resource";

export interface IResourceRepository {
  findByDepartment(department: string): Promise<IResource | null>;
  findAll(): Promise<IResource[]>;
  createOrUpdate(department: string, data: Partial<IResource>): Promise<IResource>;
}
