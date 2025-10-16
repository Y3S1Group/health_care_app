export interface IRole {
  _id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoleRepository {
  findByName(name: string): Promise<IRole | null>;
  findById(id: string): Promise<IRole | null>;
  create(role: Partial<IRole>): Promise<IRole>;
  findAll(): Promise<IRole[]>;
}