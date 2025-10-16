import mongoose, { Schema } from "mongoose";

export interface IAuditLog extends Document {
  actorId: string;
  action: string;
  target: string;
  timestamp: Date;
  details: any;
}

const AuditLogSchema = new Schema({
  actorId: { type: String, required: true, uppercase: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: Schema.Types.Mixed }
}, { timestamps: true });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);