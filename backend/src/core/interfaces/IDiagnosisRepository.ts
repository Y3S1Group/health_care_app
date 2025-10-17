export interface IDiagnosis {
  _id?: string;
  patientId: string;
  description: string;
  diagnosisDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDiagnosisRepository {
  create(diagnosis: Partial<IDiagnosis>): Promise<IDiagnosis>;
  findById(id: string): Promise<IDiagnosis | null>;
  findByPatientId(patientId: string): Promise<IDiagnosis[]>;
  update(id: string, diagnosis: Partial<IDiagnosis>): Promise<IDiagnosis | null>;
  delete(id: string): Promise<void>;
}