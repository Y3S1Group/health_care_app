import { IResourceAllocation } from "../../models/ResourceAllocation";

export interface IResourceAllocationRepository {
  create(data: Partial<IResourceAllocation>): Promise<IResourceAllocation>;
  findByAllocationID(allocationID: string): Promise<IResourceAllocation | null>;
  findAll(): Promise<IResourceAllocation[]>;
  update(allocationID: string, data: Partial<IResourceAllocation>): Promise<IResourceAllocation>;
  delete(allocationID: string): Promise<boolean>;
}
