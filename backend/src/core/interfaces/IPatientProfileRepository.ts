export interface IPatientProfile {
  _id?: string;
  userId: string;
  
  // Vitals
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  
  // Billing
  totalCharges?: number;
  paidAmount?: number;
  outstanding?: number;
  
  // Insurance
  insuranceProvider?: string;
  policyNumber?: string;
  groupNumber?: string;
  
  // Discharge
  dischargeDate?: Date;
  attendingPhysician?: string;
  dischargeSummary?: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPatientProfileRepository {
  create(profile: Partial<IPatientProfile>): Promise<IPatientProfile>;
  findByUserId(userId: string): Promise<IPatientProfile | null>;
  findById(id: string): Promise<IPatientProfile | null>;
  update(userId: string, profile: Partial<IPatientProfile>): Promise<IPatientProfile | null>;
  delete(userId: string): Promise<void>;
  findAll(): Promise<IPatientProfile[]>;
}