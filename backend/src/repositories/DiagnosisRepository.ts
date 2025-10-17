import {
  IDiagnosisRepository,
  IDiagnosis,
} from '../core/interfaces/IDiagnosisRepository';
import { DiagnosisModel, IDiagnosisDocument } from '../models/Diagnosis';

export class DiagnosisRepository implements IDiagnosisRepository {
  async create(diagnosis: Partial<IDiagnosis>): Promise<IDiagnosis> {
    const doc: IDiagnosisDocument = await DiagnosisModel.create(diagnosis);
    return this.mapToInterface(doc);
  }

  async findById(id: string): Promise<IDiagnosis | null> {
    const diagnosis = await DiagnosisModel.findById(id).lean().exec();
    if (!diagnosis) return null;
    return this.mapToInterface(diagnosis);
  }

  async findByPatientId(patientId: string): Promise<IDiagnosis[]> {
    const diagnoses = await DiagnosisModel.find({ patientId })
      .sort({ diagnosisDate: -1 })
      .lean()
      .exec();
    return diagnoses.map((diagnosis) => this.mapToInterface(diagnosis));
  }

  async update(
    id: string,
    diagnosis: Partial<IDiagnosis>
  ): Promise<IDiagnosis | null> {
    const updated = await DiagnosisModel.findByIdAndUpdate(id, diagnosis, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();

    if (!updated) return null;
    return this.mapToInterface(updated);
  }

  async delete(id: string): Promise<void> {
    await DiagnosisModel.findByIdAndDelete(id).exec();
  }

  private mapToInterface(doc: any): IDiagnosis {
    return {
      _id: doc._id.toString(),
      patientId: doc.patientId.toString(),
      description: doc.description,
      diagnosisDate: doc.diagnosisDate,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}