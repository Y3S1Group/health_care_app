import mongoose, { Schema, model, Document } from "mongoose";

export interface IResourceAllocation extends Document {
  allocationID: string;
  managerID: string;
  hospitalID: string;
  department: string;
  staffIds: string[];
  bedCount: number;
  equipment: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}


const ResourceAllocationSchema = new Schema({
  allocationID: { type: String, required: true, unique: true, uppercase: true },
  managerID: { type: String, required: true, uppercase: true },
  hospitalID: { type: String, required: true, uppercase: true },
  department: { type: String, required: true, uppercase: true },
  staffIds: [{ type: String, uppercase: true }],
  bedCount: { type: Number, required: true, min: 0 },
  equipment: [{ type: String }],
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'PENDING'], default: 'ACTIVE' }
}, { timestamps: true });

export const ResourceAllocation = mongoose.model<IResourceAllocation>('ResourceAllocation', ResourceAllocationSchema);


