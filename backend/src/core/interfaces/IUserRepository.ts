export interface IUser {
  _id?: string;
  userId: string;      // NEW
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserRepository {
  create(user: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findByUserId(userId: string): Promise<IUser | null>;  // NEW
}