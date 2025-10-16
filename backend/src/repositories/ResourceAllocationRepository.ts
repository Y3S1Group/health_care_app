import { NotFoundError } from "../core/errors/NotFoundError";
import { IResourceAllocationRepository } from "../core/interfaces/IResourceAllocationRepository";
import { IResourceAllocation, ResourceAllocation } from "../models/ResourceAllocation";

export class ResourceAllocationRepository implements IResourceAllocationRepository {
  async create(data: Partial<IResourceAllocation>): Promise<IResourceAllocation> {
    const allocation = new ResourceAllocation(data);
    return await allocation.save();
  }

  async findByAllocationID(allocationID: string): Promise<IResourceAllocation | null> {
    return await ResourceAllocation.findOne({ allocationID });
  }

  async findAll(): Promise<IResourceAllocation[]> {
    return await ResourceAllocation.find().sort({ createdAt: -1 });
  }

  async update(allocationID: string, data: Partial<IResourceAllocation>): Promise<IResourceAllocation> {
    const allocation = await ResourceAllocation.findOneAndUpdate(
      { allocationID },
      data,
      { new: true, runValidators: true }
    );
    if (!allocation) throw new NotFoundError('ResourceAllocation');
    return allocation;
  }

  async delete(allocationID: string): Promise<boolean> {
    const result = await ResourceAllocation.deleteOne({ allocationID });
    return result.deletedCount > 0;
  }
}