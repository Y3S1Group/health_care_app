export interface IPrescription {
  _id?: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPrescriptionRepository {
  create(prescription: Partial<IPrescription>): Promise<IPrescription>;
  findById(id: string): Promise<IPrescription | null>;
  findByPatientId(patientId: string): Promise<IPrescription[]>;
  update(id: string, prescription: Partial<IPrescription>): Promise<IPrescription | null>;
  delete(id: string): Promise<void>;
  findActiveByPatientId(patientId: string): Promise<IPrescription[]>;
}