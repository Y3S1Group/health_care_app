import { IDiagnosisRepository } from '../core/interfaces/IDiagnosisRepository';
import { IUserRepository } from '../core/interfaces/IUserRepository';
import { ValidationError } from '../core/errors/ValidationError';

export interface CreateDiagnosisDTO {
  patientId: string;
  description: string;
  diagnosisDate?: Date;
}

export interface UpdateDiagnosisDTO {
  description?: string;
  diagnosisDate?: Date;
}

export class DiagnosisService {
  constructor(
    private diagnosisRepo: IDiagnosisRepository,
    private userRepo: IUserRepository
  ) {}

  async createDiagnosis(data: CreateDiagnosisDTO) {
    // Verify patient exists and has patient role
    const user = await this.userRepo.findById(data.patientId);
    if (!user) {
      throw new ValidationError('Patient not found');
    }

    if (user.role !== 'patient') {
      throw new ValidationError('User must be a patient');
    }

    return await this.diagnosisRepo.create(data);
  }

  async getDiagnosisById(id: string) {
    const diagnosis = await this.diagnosisRepo.findById(id);
    if (!diagnosis) {
      throw new ValidationError('Diagnosis not found');
    }
    return diagnosis;
  }

  async getDiagnosesByPatientId(patientId: string) {
    return await this.diagnosisRepo.findByPatientId(patientId);
  }

  async updateDiagnosis(id: string, data: UpdateDiagnosisDTO) {
    const diagnosis = await this.diagnosisRepo.findById(id);
    if (!diagnosis) {
      throw new ValidationError('Diagnosis not found');
    }

    const updated = await this.diagnosisRepo.update(id, data);
    if (!updated) {
      throw new ValidationError('Failed to update diagnosis');
    }

    return updated;
  }

  async deleteDiagnosis(id: string) {
    const diagnosis = await this.diagnosisRepo.findById(id);
    if (!diagnosis) {
      throw new ValidationError('Diagnosis not found');
    }

    await this.diagnosisRepo.delete(id);
  }

  // ADD these methods to DiagnosisService class

async createDiagnosisByCustomUserId(data: Omit<CreateDiagnosisDTO, 'patientId'> & { customUserId: string }) {
  // Find patient by custom userId
  const user = await this.userRepo.findByUserId(data.customUserId);
  if (!user) {
    throw new ValidationError('Patient not found');
  }

  if (user.role !== 'patient') {
    throw new ValidationError('User must be a patient');
  }

  // Create diagnosis using MongoDB _id
  return await this.createDiagnosis({
    patientId: user._id as string,
    description: data.description,
    diagnosisDate: data.diagnosisDate,
  });
}

async getDiagnosesByCustomUserId(customUserId: string) {
  // Find patient by custom userId
  const user = await this.userRepo.findByUserId(customUserId);
  if (!user) {
    throw new ValidationError('Patient not found');
  }

  // Get diagnoses using MongoDB _id
  return await this.getDiagnosesByPatientId(user._id as string);
}
}