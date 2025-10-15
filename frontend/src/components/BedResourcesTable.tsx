import React from 'react';
import type { BedResource } from '../types';

interface BedResourcesTableProps {
  beds: BedResource[];
}

export const BedResourcesTable: React.FC<BedResourcesTableProps> = ({ beds }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Bed Resources</h3>
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 border-b">
                <th className="pb-3 px-4 sm:px-0">Bed Resources</th>
                <th className="pb-3 px-2">Room</th>
                <th className="pb-3 px-2">Department</th>
                <th className="pb-3 px-2">Type</th>
                <th className="pb-3 px-2">current patient</th>
                <th className="pb-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {beds.map((bed, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 sm:px-0 text-gray-600 text-xs max-w-xs">{bed.bedID}</td>
                  <td className="py-3 px-2 text-gray-600">{bed.room}</td>
                  <td className="py-3 px-2 text-gray-600">{bed.department}</td>
                  <td className="py-3 px-2 text-gray-600">{bed.type}</td>
                  <td className="py-3 px-2 text-gray-600">{bed.currentPatient}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      {bed.status === 'Occupied' && (
                        <>
                          <input type="checkbox" checked className="text-green-600" readOnly />
                          <span className="text-green-600 text-xs">{bed.status}</span>
                        </>
                      )}
                      {bed.status === 'Available' && (
                        <>
                          <input type="checkbox" className="text-gray-400" />
                          <span className="text-gray-600 text-xs">{bed.status}</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};