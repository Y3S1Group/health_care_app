import { Schema, model, Document } from 'mongoose';

export interface IPatientProfileDocument extends Document {
  userId: Schema.Types.ObjectId;
  
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
  
  // Discharge Summary
  dischargeDate?: Date;
  attendingPhysician?: string;
  dischargeSummary?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const PatientProfileSchema = new Schema<IPatientProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    
    // Vitals
    temperature: {
      type: Number,
      min: 35,
      max: 45,
    },
    bloodPressure: {
      type: String,
      trim: true,
    },
    heartRate: {
      type: Number,
      min: 30,
      max: 200,
    },
    
    // Billing
    totalCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    outstanding: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Insurance
    insuranceProvider: {
      type: String,
      trim: true,
    },
    policyNumber: {
      type: String,
      trim: true,
    },
    groupNumber: {
      type: String,
      trim: true,
    },
    
    // Discharge
    dischargeDate: {
      type: Date,
    },
    attendingPhysician: {
      type: String,
      trim: true,
    },
    dischargeSummary: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
PatientProfileSchema.index({ userId: 1 });

// Virtual to check if cleared for discharge
PatientProfileSchema.virtual('isClearedForDischarge').get(function() {
  return this.dischargeDate != null;
});

export const PatientProfileModel = model<IPatientProfileDocument>(
  'PatientProfile',
  PatientProfileSchema
);