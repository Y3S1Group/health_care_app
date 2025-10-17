import { Schema, model, Document } from 'mongoose';

export interface IDiagnosisDocument extends Document {
  patientId: Schema.Types.ObjectId;
  description: string;
  diagnosedBy?: string;
  diagnosisDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DiagnosisSchema = new Schema<IDiagnosisDocument>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    diagnosedBy: {
      type: String,
      trim: true,
    },
    diagnosisDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

DiagnosisSchema.index({ patientId: 1 });
DiagnosisSchema.index({ diagnosisDate: -1 });

export const DiagnosisModel = model<IDiagnosisDocument>('Diagnosis', DiagnosisSchema);