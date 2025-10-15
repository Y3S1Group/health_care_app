import React from 'react';
import type { EquipmentResource } from '../types';

interface EquipmentResourcesTableProps {
  equipment: EquipmentResource[];
}

export const EquipmentResourcesTable: React.FC<EquipmentResourcesTableProps> = ({ equipment }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Equipment Resources</h3>
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 border-b">
                <th className="pb-3 px-4 sm:px-0">Equipment Resources</th>
                <th className="pb-3 px-2">Department</th>
                <th className="pb-3 px-2">Type</th>
                <th className="pb-3 px-2">Availability</th>
                <th className="pb-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {equipment.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 sm:px-0 font-medium">{item.name}</td>
                  <td className="py-3 px-2 text-gray-600">{item.department}</td>
                  <td className="py-3 px-2 text-gray-600">{item.type}</td>
                  <td className="py-3 px-2 text-gray-600">{item.availability}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      {item.status === 'Operational' && (
                        <>
                          <input type="checkbox" checked className="text-green-600" readOnly />
                          <span className="text-green-600 text-xs">{item.status}</span>
                        </>
                      )}
                      {item.status === 'In Use' && (
                        <>
                          <input type="checkbox" checked className="text-green-600" readOnly />
                          <span className="text-green-600 text-xs">{item.status}</span>
                        </>
                      )}
                      {item.status === 'Maintenance' && (
                        <>
                          <input type="checkbox" className="text-red-600" />
                          <span className="text-red-600 text-xs">{item.status}</span>
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