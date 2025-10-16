import bcrypt from 'bcrypt';
import { IUserRepository } from '../core/interfaces/IUserRepository';
import { TokenService } from './TokenService';
import { ValidationError } from '../core/errors/ValidationError';
import { UnauthorizedError } from '../core/errors/UnauthorizedError';

export interface SignupDTO {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export class AuthService {
  constructor(
    private userRepo: IUserRepository,
    private tokenService: TokenService
  ) {}

  async signup(data: SignupDTO): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError('Email already in use');
    }

    // Validate role
    const validRoles = ['admin', 'doctor', 'nurse', 'manager', 'staff'];
    if (!validRoles.includes(data.role.toLowerCase())) {
      throw new ValidationError('Invalid role');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await this.userRepo.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role.toLowerCase(),
    });

    // Generate token
    const token = this.tokenService.generateToken({
      sub: user._id as string,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user._id as string,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user
    const user = await this.userRepo.findByEmail(data.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate token
    const token = this.tokenService.generateToken({
      sub: user._id as string,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user._id as string,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}