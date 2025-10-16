import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserRepository } from '../repositories/UserRepository';
import { TokenService } from '../services/TokenService';
import { AuthService } from '../services/AuthService';
import { validate } from '../middleware/validator';
import { signupSchema, loginSchema } from '../validators/authSchemas';
import { auth } from '../middleware/auth';

const router = Router();

// Setup dependencies
const userRepo = new UserRepository();
const tokenService = new TokenService();
const authService = new AuthService(userRepo, tokenService);
const authController = new AuthController(authService);

// Public routes
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

// Protected routes
router.get('/profile', auth, authController.getProfile);

export default router;