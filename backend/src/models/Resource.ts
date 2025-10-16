import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
    resourceID: string;
    department: string;
    bedCount: number;
    equipment: string[];
    availableStaff: number;
    totalStaff: number;
}

const ResourceSchema = new Schema({
  resourceID: { type: String, required: true, unique: true, uppercase: true },
  department: { type: String, required: true, unique: true, uppercase: true },
  bedCount: { type: Number, required: true, min: 0 },
  equipment: [{ type: String }],
  availableStaff: { type: Number, default: 0 },
  totalStaff: { type: Number, default: 0 }
}, { timestamps: true });

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
