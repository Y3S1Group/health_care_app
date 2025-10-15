import React from 'react';
import { CreateAllocationForm } from './CreateAllocationForm';
import { type AllocationData } from '../types';

interface AllocationPlanTabProps {
  onAllocate: (data: any) => Promise<void>;
  loading: boolean;
  managerID: string;
  allocations: AllocationData[];
  hospitals: any[];
  staffResources: any[];
}

export const AllocationPlanTab: React.FC<AllocationPlanTabProps> = ({ 
  onAllocate, 
  loading, 
  managerID,
  allocations,
  hospitals,
  staffResources
}) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">Resource allocation plan</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Allocation Form - Real Data */}
        <div>
          <CreateAllocationForm 
            onSubmit={onAllocate} 
            loading={loading}
            hospitals={hospitals}
            staffResources={staffResources}
          />
        </div>

        {/* Current Allocations - Real Data */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Allocations</h3>
          <div className="space-y-4">
            {allocations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No allocations yet. Create one to get started.
              </div>
            ) : (
              allocations.map((allocation) => (
                <div key={allocation.allocationID} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{allocation.department}</h4>
                      <p className="text-xs text-gray-500">ID: {allocation.allocationID}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      allocation.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      allocation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {allocation.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Staff: {allocation.staffIds.length} members</p>
                    <p>Beds: {allocation.bedCount}</p>
                    <p>Equipment: {allocation.equipment.length} items</p>
                  </div>
                  <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                    Created: {new Date(allocation.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};