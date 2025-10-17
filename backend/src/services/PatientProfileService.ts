import { IPatientProfileRepository } from '../core/interfaces/IPatientProfileRepository';
import { IUserRepository } from '../core/interfaces/IUserRepository';
import { ValidationError } from '../core/errors/ValidationError';

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

export class PatientProfileService {
  constructor(
    private patientProfileRepo: IPatientProfileRepository,
    private userRepo: IUserRepository
  ) {}

  async createProfile(data: CreatePatientProfileDTO) {
    // Check if user exists and is a patient
    const user = await this.userRepo.findById(data.userId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    if (user.role !== 'patient') {
      throw new ValidationError('User must have patient role');
    }

    // Check if profile already exists
    const existingProfile = await this.patientProfileRepo.findByUserId(data.userId);
    if (existingProfile) {
      throw new ValidationError('Patient profile already exists');
    }

    // Calculate outstanding if billing info provided
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
    // Check if profile exists
    const existingProfile = await this.patientProfileRepo.findByUserId(userId);
    if (!existingProfile) {
      throw new ValidationError('Patient profile not found');
    }

    // Calculate outstanding if billing info updated
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

  // ADD this method to PatientProfileService class
async getProfileByCustomUserId(customUserId: string) {
  // First find the user by custom userId
  const user = await this.userRepo.findByUserId(customUserId);
  if (!user) {
    throw new ValidationError('User not found');
  }

  // Then get their profile using MongoDB _id
  const profile = await this.patientProfileRepo.findByUserId(user._id as string);
  if (!profile) {
    throw new ValidationError('Patient profile not found');
  }
  return profile;
}

async updateProfileByCustomUserId(customUserId: string, data: UpdatePatientProfileDTO) {
  // First find the user by custom userId
  const user = await this.userRepo.findByUserId(customUserId);
  if (!user) {
    throw new ValidationError('User not found');
  }

  // Then update their profile using MongoDB _id
  return await this.updateProfile(user._id as string, data);
}

async deleteProfileByCustomUserId(customUserId: string) {
  // First find the user by custom userId
  const user = await this.userRepo.findByUserId(customUserId);
  if (!user) {
    throw new ValidationError('User not found');
  }

  // Then delete their profile using MongoDB _id
  await this.deleteProfile(user._id as string);
}

async createProfileByCustomUserId(data: Omit<CreatePatientProfileDTO, 'userId'> & { userId: string }) {
  // Find user by custom userId
  const user = await this.userRepo.findByUserId(data.userId);
  if (!user) {
    throw new ValidationError('User not found');
  }

  // Create profile using MongoDB _id
  return await this.createProfile({
    ...data,
    userId: user._id as string,
  });
}
}