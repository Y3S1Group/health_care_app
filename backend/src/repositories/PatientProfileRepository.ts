import {
  IPatientProfileRepository,
  IPatientProfile,
} from '../core/interfaces/IPatientProfileRepository';
import { PatientProfileModel, IPatientProfileDocument } from '../models/PatientProfile';

export class PatientProfileRepository implements IPatientProfileRepository {
  async create(profile: Partial<IPatientProfile>): Promise<IPatientProfile> {
    const doc: IPatientProfileDocument = await PatientProfileModel.create(profile);
    return this.mapToInterface(doc);
  }

  async findByUserId(userId: string): Promise<IPatientProfile | null> {
    const profile = await PatientProfileModel.findOne({ userId }).lean().exec();
    if (!profile) return null;
    return this.mapToInterface(profile);
  }

  async findById(id: string): Promise<IPatientProfile | null> {
    const profile = await PatientProfileModel.findById(id).lean().exec();
    if (!profile) return null;
    return this.mapToInterface(profile);
  }

  async update(
    userId: string,
    profile: Partial<IPatientProfile>
  ): Promise<IPatientProfile | null> {
    const updated = await PatientProfileModel.findOneAndUpdate(
      { userId },
      profile,
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    if (!updated) return null;
    return this.mapToInterface(updated);
  }

  async delete(userId: string): Promise<void> {
    await PatientProfileModel.findOneAndDelete({ userId }).exec();
  }

  async findAll(): Promise<IPatientProfile[]> {
    const profiles = await PatientProfileModel.find().lean().exec();
    return profiles.map((profile) => this.mapToInterface(profile));
  }

  private mapToInterface(doc: any): IPatientProfile {
    return {
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      temperature: doc.temperature,
      bloodPressure: doc.bloodPressure,
      heartRate: doc.heartRate,
      totalCharges: doc.totalCharges,
      paidAmount: doc.paidAmount,
      outstanding: doc.outstanding,
      insuranceProvider: doc.insuranceProvider,
      policyNumber: doc.policyNumber,
      groupNumber: doc.groupNumber,
      dischargeDate: doc.dischargeDate,
      attendingPhysician: doc.attendingPhysician,
      dischargeSummary: doc.dischargeSummary,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}