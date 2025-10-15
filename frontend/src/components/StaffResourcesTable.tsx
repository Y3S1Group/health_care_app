import React from 'react';
import type { StaffResource } from '../types';

interface StaffResourcesTableProps {
  staff: StaffResource[];
}

export const StaffResourcesTable: React.FC<StaffResourcesTableProps> = ({ staff }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Staff Resources</h3>
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 border-b">
                <th className="pb-3 px-4 sm:px-0">Staff Resources</th>
                <th className="pb-3 px-2">Role</th>
                <th className="pb-3 px-2">Department</th>
                <th className="pb-3 px-2">Shift</th>
                <th className="pb-3 px-2">Availability</th>
                <th className="pb-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {staff.map((member, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 sm:px-0 font-medium">{member.name}</td>
                  <td className="py-3 px-2 text-gray-600">{member.role}</td>
                  <td className="py-3 px-2 text-gray-600">{member.department}</td>
                  <td className="py-3 px-2 text-gray-600">{member.shift}</td>
                  <td className="py-3 px-2 text-gray-600">{member.availability}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      {member.status === 'Available' && (
                        <>
                          <input type="checkbox" checked className="text-green-600" readOnly />
                          <span className="text-green-600 text-xs">{member.status}</span>
                        </>
                      )}
                      {member.status === 'On Break' && (
                        <>
                          <input type="checkbox" className="text-gray-400" />
                          <span className="text-gray-600 text-xs">{member.status}</span>
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