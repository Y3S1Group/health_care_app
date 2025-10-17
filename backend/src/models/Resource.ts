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
  resourceID: { 
    type: String, 
    required: true,  
    uppercase: true 
  },
  department: { type: String, required: true, unique: true, uppercase: true },
  bedCount: { type: Number, required: true, min: 0 },
  equipment: [{ type: String }],
  availableStaff: { type: Number, default: 0 },
  totalStaff: { type: Number, default: 0 }
}, { timestamps: true });

ResourceSchema.pre('save', async function(next) {
    if (!this.resourceID) {
        const count = await mongoose.model('Resource').countDocuments();
        this.resourceID = `RES${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
