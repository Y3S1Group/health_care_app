import { Schema, model, Document } from 'mongoose';

export interface IRoleDocument extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRoleDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      enum: ['admin', 'doctor', 'nurse', 'manager', 'staff', 'patient'],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RoleModel = model<IRoleDocument>('Role', RoleSchema);