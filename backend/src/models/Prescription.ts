import { Schema, model, Document } from 'mongoose';

export interface IPrescriptionDocument extends Document {
  patientId: Schema.Types.ObjectId;
  medicationName: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  prescribedBy?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionSchema = new Schema<IPrescriptionDocument>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    medicationName: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: String,
      required: true,
      trim: true,
    },
    instructions: {
      type: String,
      trim: true,
    },
    prescribedBy: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

PrescriptionSchema.index({ patientId: 1 });
PrescriptionSchema.index({ isActive: 1 });
PrescriptionSchema.index({ startDate: -1 });

export const PrescriptionModel = model<IPrescriptionDocument>(
  'Prescription',
  PrescriptionSchema
);