import { Request, Response, NextFunction } from 'express';
import { PatientProfileService } from '../services/PatientProfileService';
import { AuthRequest } from '../middleware/auth';

export class PatientProfileController {
  constructor(private patientProfileService: PatientProfileService) {}

  createProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await this.patientProfileService.createProfile(req.body);

      res.status(201).json({
        success: true,
        message: 'Patient profile created successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  getProfileByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const profile = await this.patientProfileService.getProfileByUserId(userId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      const profile = await this.patientProfileService.getProfileByUserId(userId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const profile = await this.patientProfileService.updateProfile(userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Patient profile updated successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      await this.patientProfileService.deleteProfile(userId);

      res.status(200).json({
        success: true,
        message: 'Patient profile deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getAllProfiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profiles = await this.patientProfileService.getAllProfiles();

      res.status(200).json({
        success: true,
        data: profiles,
      });
    } catch (error) {
      next(error);
    }
  };

  checkDischargeStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const isCleared = await this.patientProfileService.isClearedForDischarge(userId);

      res.status(200).json({
        success: true,
        data: {
          userId,
          isClearedForDischarge: isCleared,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // ADD these methods to PatientProfileController class

getProfileByCustomUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params; // This is the custom userId like PAT-202510-0001
    const profile = await this.patientProfileService.getProfileByCustomUserId(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

updateProfileByCustomUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params; // Custom userId
    const profile = await this.patientProfileService.updateProfileByCustomUserId(userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Patient profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

createProfileByCustomUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await this.patientProfileService.createProfileByCustomUserId(req.body);

    res.status(201).json({
      success: true,
      message: 'Patient profile created successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

deleteProfileByCustomUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params; // Custom userId
    await this.patientProfileService.deleteProfileByCustomUserId(userId);

    res.status(200).json({
      success: true,
      message: 'Patient profile deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

searchPatientByCustomId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patientId } = req.params;
    const user = req.user;

    if (!user) {
      throw new Error('User authentication required');
    }

    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                     req.socket.remoteAddress || 
                     'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const result = await this.patientProfileService.searchPatientByCustomId(
      patientId,
      {
        staffId: user.id,
        staffRole: user.role,
        ipAddress,
        userAgent,
        sessionId: req.headers['x-session-id'] as string,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Patient profile retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

updatePatientByCustomId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patientId } = req.params;
    const user = req.user;

    if (!user) {
      throw new Error('User authentication required');
    }

    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                     req.socket.remoteAddress || 
                     'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const updated = await this.patientProfileService.updatePatientByCustomId(
      patientId,
      req.body,
      {
        staffId: user.id,
        staffRole: user.role,
        ipAddress,
        userAgent,
        sessionId: req.headers['x-session-id'] as string,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Patient profile updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

getPatientAccessHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patientId } = req.params;
    const history = await this.patientProfileService.getPatientAccessHistory(patientId);

    res.status(200).json({
      success: true,
      message: 'Patient access history retrieved successfully',
      data: history,
    });
  } catch (error) {
    next(error);
  }
};
}