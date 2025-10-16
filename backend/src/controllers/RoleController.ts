import { Request, Response, NextFunction } from 'express';
import { RoleRepository } from '../repositories/RoleRepository';

export class RoleController {
  private roleRepo: RoleRepository;

  constructor() {
    this.roleRepo = new RoleRepository();
  }

  getAllRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roles = await this.roleRepo.findAll();
      
      res.status(200).json({
        success: true,
        message: 'Roles retrieved successfully',
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  };

  getRoleByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name } = req.params;
      const role = await this.roleRepo.findByName(name);
      
      if (!role) {
        res.status(404).json({
          success: false,
          message: 'Role not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Role retrieved successfully',
        data: role,
      });
    } catch (error) {
      next(error);
    }
  };
}