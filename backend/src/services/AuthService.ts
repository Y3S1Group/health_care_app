import bcrypt from 'bcrypt';
import { IUserRepository } from '../core/interfaces/IUserRepository';
import { TokenService } from './TokenService';
import { CounterService } from './CounterService';
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
    userId: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export class AuthService {
  private counterService: CounterService;

  constructor(
    private userRepo: IUserRepository,
    private tokenService: TokenService
  ) {
    this.counterService = new CounterService();
  }

  async signup(data: SignupDTO): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError('Email already in use');
    }

    // Validate role
    const validRoles = ['admin', 'doctor', 'nurse', 'manager', 'staff', 'patient'];
    if (!validRoles.includes(data.role.toLowerCase())) {
      throw new ValidationError('Invalid role');
    }

    // Generate custom userId (e.g., MGR-202510-0001)
    const userId = await this.counterService.generateUserId(data.role);

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await this.userRepo.create({
      userId,
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role.toLowerCase(),
    });

    // ✅ No separate manager repo logic needed
    console.log(`✅ User created with ID ${userId} (${data.role})`);

    // Generate token
    const token = this.tokenService.generateToken({
      sub: user._id as string,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user._id as string,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepo.findByEmail(data.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = this.tokenService.generateToken({
      sub: user._id as string,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user._id as string,
        userId: user.userId,
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
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
