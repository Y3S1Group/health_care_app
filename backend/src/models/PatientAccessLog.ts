import { Schema, model, Document } from 'mongoose';

export interface IPatientAccessLogDocument extends Document {
  staffId: string;
  staffRole: string;
  patientUserId: string;
  patientMongoId: Schema.Types.ObjectId;
  accessType: 'view' | 'update' | 'create' | 'delete';
  accessedFields?: string[];
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  sessionId?: string;
}

const PatientAccessLogSchema = new Schema<IPatientAccessLogDocument>(
  {
    staffId: {
      type: String,
      required: true,
      index: true,
    },
    staffRole: {
      type: String,
      required: true,
      enum: ['admin', 'doctor', 'nurse', 'staff', 'manager'],
    },
    patientUserId: {
      type: String,
      required: true,
      index: true,
    },
    patientMongoId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    accessType: {
      type: String,
      required: true,
      enum: ['view', 'update', 'create', 'delete'],
    },
    accessedFields: [{
      type: String,
    }],
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    sessionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

PatientAccessLogSchema.index({ patientUserId: 1, timestamp: -1 });
PatientAccessLogSchema.index({ staffId: 1, timestamp: -1 });
PatientAccessLogSchema.index({ timestamp: -1 });

export const PatientAccessLogModel = model<IPatientAccessLogDocument>(
  'PatientAccessLog',
  PatientAccessLogSchema
);