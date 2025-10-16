import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../core/errors/UnauthorizedError';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export class TokenService {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: '24h' });
  }

  verifyToken(token: string): TokenPayload {
    try {
      // ✅ CORRECT ORDER: jwt.verify(token, secret)
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
}