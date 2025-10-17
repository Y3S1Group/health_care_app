import { IPrescriptionRepository } from '../core/interfaces/IPrescriptionRepository';
import { IUserRepository } from '../core/interfaces/IUserRepository';
import { ValidationError } from '../core/errors/ValidationError';

export interface CreatePrescriptionDTO {
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdatePrescriptionDTO {
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  instructions?: string;
  startDate?: Date;
  endDate?: Date;
}

export class PrescriptionService {
  constructor(
    private prescriptionRepo: IPrescriptionRepository,
    private userRepo: IUserRepository
  ) {}

  async createPrescription(data: CreatePrescriptionDTO) {
    // Verify patient exists and has patient role
    const user = await this.userRepo.findById(data.patientId);
    if (!user) {
      throw new ValidationError('Patient not found');
    }

    if (user.role !== 'patient') {
      throw new ValidationError('User must be a patient');
    }

    // Validate dates
    if (data.endDate && data.startDate && data.endDate < data.startDate) {
      throw new ValidationError('End date cannot be before start date');
    }

    return await this.prescriptionRepo.create(data);
  }

  async getPrescriptionById(id: string) {
    const prescription = await this.prescriptionRepo.findById(id);
    if (!prescription) {
      throw new ValidationError('Prescription not found');
    }
    return prescription;
  }

  async getPrescriptionsByPatientId(patientId: string) {
    return await this.prescriptionRepo.findByPatientId(patientId);
  }

  async getActivePrescriptionsByPatientId(patientId: string) {
    return await this.prescriptionRepo.findActiveByPatientId(patientId);
  }

  async updatePrescription(id: string, data: UpdatePrescriptionDTO) {
    const prescription = await this.prescriptionRepo.findById(id);
    if (!prescription) {
      throw new ValidationError('Prescription not found');
    }

    // Validate dates if both are provided
    if (data.endDate && data.startDate && data.endDate < data.startDate) {
      throw new ValidationError('End date cannot be before start date');
    }

    const updated = await this.prescriptionRepo.update(id, data);
    if (!updated) {
      throw new ValidationError('Failed to update prescription');
    }

    return updated;
  }

  async deletePrescription(id: string) {
    const prescription = await this.prescriptionRepo.findById(id);
    if (!prescription) {
      throw new ValidationError('Prescription not found');
    }

    await this.prescriptionRepo.delete(id);
  }

  // ADD these methods to PrescriptionService class

async createPrescriptionByCustomUserId(data: Omit<CreatePrescriptionDTO, 'patientId'> & { customUserId: string }) {
  // Find patient by custom userId
  const user = await this.userRepo.findByUserId(data.customUserId);
  if (!user) {
    throw new ValidationError('Patient not found');
  }

  if (user.role !== 'patient') {
    throw new ValidationError('User must be a patient');
  }

  // Validate dates
  if (data.endDate && data.startDate && data.endDate < data.startDate) {
    throw new ValidationError('End date cannot be before start date');
  }

  // Create prescription using MongoDB _id
  return await this.createPrescription({
    patientId: user._id as string,
    medicationName: data.medicationName,
    dosage: data.dosage,
    frequency: data.frequency,
    instructions: data.instructions,
    startDate: data.startDate,
    endDate: data.endDate,
  });
}

async getPrescriptionsByCustomUserId(customUserId: string) {
  // Find patient by custom userId
  const user = await this.userRepo.findByUserId(customUserId);
  if (!user) {
    throw new ValidationError('Patient not found');
  }

  // Get prescriptions using MongoDB _id
  return await this.getPrescriptionsByPatientId(user._id as string);
}

async getActivePrescriptionsByCustomUserId(customUserId: string) {
  // Find patient by custom userId
  const user = await this.userRepo.findByUserId(customUserId);
  if (!user) {
    throw new ValidationError('Patient not found');
  }

  // Get active prescriptions using MongoDB _id
  return await this.getActivePrescriptionsByPatientId(user._id as string);
}
}