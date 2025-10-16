import { IUserRepository, IUser } from '../core/interfaces/IUserRepository';
import { UserModel, IUserDocument } from '../models/User';

export class UserRepository implements IUserRepository {
  async create(user: Partial<IUser>): Promise<IUser> {
    const doc: IUserDocument = await UserModel.create(user);
    return {
      _id: (doc._id as any).toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean().exec();
    if (!user) return null;

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id).lean().exec();
    if (!user) return null;

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}