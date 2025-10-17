export interface PatientProfile {
  _id: string;
  userId: string;
  customUserId?: string;
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  totalCharges?: number;
  paidAmount?: number;
  outstanding?: number;
  insuranceProvider?: string;
  policyNumber?: string;
  groupNumber?: string;
  dischargeDate?: string;
  attendingPhysician?: string;
  dischargeSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientProfileDTO {
  userId: string;
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  totalCharges?: number;
  paidAmount?: number;
  insuranceProvider?: string;
  policyNumber?: string;
  groupNumber?: string;
  attendingPhysician?: string;
}

export interface UpdatePatientProfileDTO {
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  totalCharges?: number;
  paidAmount?: number;
  insuranceProvider?: string;
  policyNumber?: string;
  groupNumber?: string;
  dischargeDate?: string;
  attendingPhysician?: string;
  dischargeSummary?: string;
}

export interface Diagnosis {
  _id: string;
  patientId: string;
  description: string;
  diagnosisDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiagnosisDTO {
  customUserId: string;
  description: string;
  diagnosisDate?: string;
}

export interface UpdateDiagnosisDTO {
  description?: string;
  diagnosisDate?: string;
}

export interface Prescription {
  _id: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrescriptionDTO {
  customUserId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdatePrescriptionDTO {
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  instructions?: string;
  startDate?: string;
  endDate?: string;
}