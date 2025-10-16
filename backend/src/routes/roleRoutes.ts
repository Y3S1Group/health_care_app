import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';

const router = Router();
const roleController = new RoleController();

// Get all roles
router.get('/', roleController.getAllRoles);

// Get role by name
router.get('/:name', roleController.getRoleByName);

export default router;