import {
  IPrescriptionRepository,
  IPrescription,
} from '../core/interfaces/IPrescriptionRepository';
import { PrescriptionModel, IPrescriptionDocument } from '../models/Prescription';

export class PrescriptionRepository implements IPrescriptionRepository {
  async create(prescription: Partial<IPrescription>): Promise<IPrescription> {
    const doc: IPrescriptionDocument = await PrescriptionModel.create(prescription);
    return this.mapToInterface(doc);
  }

  async findById(id: string): Promise<IPrescription | null> {
    const prescription = await PrescriptionModel.findById(id).lean().exec();
    if (!prescription) return null;
    return this.mapToInterface(prescription);
  }

  async findByPatientId(patientId: string): Promise<IPrescription[]> {
    const prescriptions = await PrescriptionModel.find({ patientId })
      .sort({ startDate: -1 })
      .lean()
      .exec();
    return prescriptions.map((prescription) => this.mapToInterface(prescription));
  }

  async findActiveByPatientId(patientId: string): Promise<IPrescription[]> {
    const now = new Date();
    const prescriptions = await PrescriptionModel.find({
      patientId,
      startDate: { $lte: now },
      $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }],
    })
      .sort({ startDate: -1 })
      .lean()
      .exec();
    return prescriptions.map((prescription) => this.mapToInterface(prescription));
  }

  async update(
    id: string,
    prescription: Partial<IPrescription>
  ): Promise<IPrescription | null> {
    const updated = await PrescriptionModel.findByIdAndUpdate(id, prescription, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();

    if (!updated) return null;
    return this.mapToInterface(updated);
  }

  async delete(id: string): Promise<void> {
    await PrescriptionModel.findByIdAndDelete(id).exec();
  }

  private mapToInterface(doc: any): IPrescription {
    return {
      _id: doc._id.toString(),
      patientId: doc.patientId.toString(),
      medicationName: doc.medicationName,
      dosage: doc.dosage,
      frequency: doc.frequency,
      instructions: doc.instructions,
      startDate: doc.startDate,
      endDate: doc.endDate,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}