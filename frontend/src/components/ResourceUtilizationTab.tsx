import React, { useMemo } from 'react';
import type { DepartmentUtilization, StaffResource } from '../types';
import { StaffResourcesTable } from './StaffResourcesTable';
import { ResourceSummaryCards } from './ResourceSummaryCards';

interface ResourceUtilizationTabProps {
  utilization: DepartmentUtilization[];
  staffResources: StaffResource[];
  loading: boolean;
  onDetectShortages: () => void;
  shortages: any[];
  suggestions: any[];
}

export const ResourceUtilizationTab: React.FC<ResourceUtilizationTabProps> = ({
  utilization,
  staffResources,
  loading,
  onDetectShortages,
  shortages,
  suggestions
}) => {
  // Calculate resource summary from real data
  const resourceSummary = useMemo(() => {
    const totalStaff = staffResources.length;
    const availableStaff = staffResources.filter(s => s.status === 'Available').length;
    
    const totalBeds = utilization.reduce((sum, dept) => sum + dept.totalBeds, 0);
    const availableBeds = utilization.reduce((sum, dept) => sum + dept.availableBeds, 0);
    
    return {
      staff: { available: availableStaff, total: totalStaff },
      beds: { available: availableBeds, total: totalBeds },
      equipment: { available: 2, total: 9 } // TODO: Get from backend
    };
  }, [staffResources, utilization]);

  // Transform staff data for table
  const tableStaff = useMemo(() => {
    return staffResources.map(staff => ({
      ...staff,
      availability: staff.shift === 'Day' ? '8AM-4PM' : '8PM-4AM',
      status: staff.status || 'Available'
    }));
  }, [staffResources]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading resource data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Resource Utilization</h2>
        <button
          onClick={onDetectShortages}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Detect Shortages
        </button>
      </div>

      {/* Shortage Alerts */}
      {shortages.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Resource Shortages Detected</h3>
              <ul className="space-y-1">
                {shortages.map((shortage, index) => (
                  <li key={index} className="text-sm text-red-800">
                    • {shortage.message} (Severity: <strong>{shortage.severity}</strong>)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Reallocation Suggestions</h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between text-sm bg-white rounded p-3">
                <span className="text-blue-800">
                  Move <strong>{suggestion.quantity} {suggestion.resourceType}</strong> from <strong>{suggestion.from}</strong> → <strong>{suggestion.to}</strong>
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  suggestion.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {suggestion.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - Real Staff Data */}
        <div className="lg:col-span-3">
          <StaffResourcesTable staff={tableStaff} />
          
          {/* TODO: Add Bed and Equipment tables with real data */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
            Bed and Equipment resources - Connect to backend endpoints
          </div>
        </div>

        {/* Sidebar - Real Resource Summary */}
        <div className="lg:col-span-1">
          <ResourceSummaryCards summary={resourceSummary} />
          
          {/* Real Utilization Stats */}
          <div className="mt-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Department Utilization</h4>
            {utilization.map((dept, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                <h5 className="text-sm font-semibold text-gray-900 mb-2">{dept.department}</h5>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Beds:</span>
                    <span>{dept.allocatedBeds}/{dept.totalBeds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <span className="text-green-600">{dept.availableBeds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilization:</span>
                    <span className={
                      dept.utilizationRate > 90 ? 'text-red-600 font-semibold' :
                      dept.utilizationRate > 70 ? 'text-orange-600' :
                      'text-green-600'
                    }>{dept.utilizationRate}%</span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      dept.status === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      dept.status === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {dept.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};