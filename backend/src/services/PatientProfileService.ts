import { IPatientProfileRepository } from '../core/interfaces/IPatientProfileRepository';
import { IUserRepository } from '../core/interfaces/IUserRepository';
import { ValidationError } from '../core/errors/ValidationError';
import { PatientAccessService } from './PatientAccessService';
import { PatientDataFilterService } from './PatientDataFilterService';

export interface CreatePatientProfileDTO {
  userId: string;
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  totalCharges?: number;
  paidAmount?: number;
  outstanding?: number;
  insuranceProvider?: string;
  policyNumber?: string;
  groupNumber?: string;
  dischargeDate?: Date;
  attendingPhysician?: string;
  dischargeSummary?: string;
}

export interface UpdatePatientProfileDTO {
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  totalCharges?: number;
  paidAmount?: number;
  outstanding?: number;
  insuranceProvider?: string;
  policyNumber?: string;
  groupNumber?: string;
  dischargeDate?: Date;
  attendingPhysician?: string;
  dischargeSummary?: string;
}

export interface AccessContext {
  staffId: string;
  staffRole: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export class PatientProfileService {
  constructor(
    private patientProfileRepo: IPatientProfileRepository,
    private userRepo: IUserRepository,
    private accessService: PatientAccessService,
    private dataFilterService: PatientDataFilterService
  ) {}

  async createProfile(data: CreatePatientProfileDTO) {
    const user = await this.userRepo.findById(data.userId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    if (user.role !== 'patient') {
      throw new ValidationError('User must have patient role');
    }

    const existingProfile = await this.patientProfileRepo.findByUserId(data.userId);
    if (existingProfile) {
      throw new ValidationError('Patient profile already exists');
    }

    if (data.totalCharges !== undefined && data.paidAmount !== undefined) {
      data.outstanding = data.totalCharges - data.paidAmount;
    }

    return await this.patientProfileRepo.create(data);
  }

  async getProfileByUserId(userId: string) {
    const profile = await this.patientProfileRepo.findByUserId(userId);
    if (!profile) {
      throw new ValidationError('Patient profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, data: UpdatePatientProfileDTO) {
    const existingProfile = await this.patientProfileRepo.findByUserId(userId);
    if (!existingProfile) {
      throw new ValidationError('Patient profile not found');
    }

    const updateData = { ...data };
    if (data.totalCharges !== undefined || data.paidAmount !== undefined) {
      const totalCharges = data.totalCharges ?? existingProfile.totalCharges ?? 0;
      const paidAmount = data.paidAmount ?? existingProfile.paidAmount ?? 0;
      updateData.outstanding = totalCharges - paidAmount;
    }

    const updated = await this.patientProfileRepo.update(userId, updateData);
    if (!updated) {
      throw new ValidationError('Failed to update profile');
    }

    return updated;
  }

  async deleteProfile(userId: string) {
    const profile = await this.patientProfileRepo.findByUserId(userId);
    if (!profile) {
      throw new ValidationError('Patient profile not found');
    }

    await this.patientProfileRepo.delete(userId);
  }

  async getAllProfiles() {
    return await this.patientProfileRepo.findAll();
  }

  async isClearedForDischarge(userId: string): Promise<boolean> {
    const profile = await this.patientProfileRepo.findByUserId(userId);
    if (!profile) {
      throw new ValidationError('Patient profile not found');
    }

    return profile.dischargeDate !== undefined && profile.dischargeDate !== null;
  }

  async searchPatientByCustomId(customUserId: string, accessContext: AccessContext) {
    const user = await this.userRepo.findByUserId(customUserId);
    if (!user) {
      throw new ValidationError('Patient not found');
    }

    const profile = await this.patientProfileRepo.findByUserId(user._id as string);
    if (!profile) {
      throw new ValidationError('Patient profile not found');
    }

    console.log('User found:', user); // DEBUG LOG
    console.log('Access context:', accessContext); // DEBUG LOG

    const filteredData = this.dataFilterService.filterByRole(profile, accessContext.staffRole);

    await this.accessService.logAccess({
      staffId: accessContext.staffId,
      staffRole: accessContext.staffRole,
      patientUserId: customUserId,
      patientMongoId: user._id as string,
      accessType: 'view',
      accessedFields: filteredData.allowedFields,
      ipAddress: accessContext.ipAddress,
      userAgent: accessContext.userAgent,
      sessionId: accessContext.sessionId,
    });

    return {
      patient: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile: filteredData.profile,
      accessInfo: {
        accessibleFields: filteredData.allowedFields,
        restrictedFields: filteredData.deniedFields,
        roleDescription: this.dataFilterService.getRoleAccessDescription(accessContext.staffRole),
      },
    };
  }

  async updatePatientByCustomId(
    customUserId: string,
    data: UpdatePatientProfileDTO,
    accessContext: AccessContext
  ) {
    const user = await this.userRepo.findByUserId(customUserId);
    if (!user) {
      throw new ValidationError('Patient not found');
    }

    const updatedFields = Object.keys(data);
    const accessibleFields = this.dataFilterService.getAccessibleFields(accessContext.staffRole);
    
    const unauthorizedFields = updatedFields.filter(
      field => !accessibleFields.includes('*') && !accessibleFields.includes(field)
    );

    if (unauthorizedFields.length > 0) {
      throw new ValidationError(
        `Access denied. You cannot modify the following fields: ${unauthorizedFields.join(', ')}`
      );
    }

    const updated = await this.updateProfile(user._id as string, data);

    await this.accessService.logAccess({
      staffId: accessContext.staffId,
      staffRole: accessContext.staffRole,
      patientUserId: customUserId,
      patientMongoId: user._id as string,
      accessType: 'update',
      accessedFields: updatedFields,
      ipAddress: accessContext.ipAddress,
      userAgent: accessContext.userAgent,
      sessionId: accessContext.sessionId,
    });

    return updated;
  }

  async getPatientAccessHistory(customUserId: string) {
    return await this.accessService.getPatientAccessHistory(customUserId);
  }

  async getProfileByCustomUserId(customUserId: string) {
    const user = await this.userRepo.findByUserId(customUserId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    const profile = await this.patientProfileRepo.findByUserId(user._id as string);
    if (!profile) {
      throw new ValidationError('Patient profile not found');
    }
    return profile;
  }

  async updateProfileByCustomUserId(customUserId: string, data: UpdatePatientProfileDTO) {
    const user = await this.userRepo.findByUserId(customUserId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    return await this.updateProfile(user._id as string, data);
  }

  async deleteProfileByCustomUserId(customUserId: string) {
    const user = await this.userRepo.findByUserId(customUserId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    await this.deleteProfile(user._id as string);
  }

  async createProfileByCustomUserId(data: Omit<CreatePatientProfileDTO, 'userId'> & { userId: string }) {
    const user = await this.userRepo.findByUserId(data.userId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    return await this.createProfile({
      ...data,
      userId: user._id as string,
    });
  }
}