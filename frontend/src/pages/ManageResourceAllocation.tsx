import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import { ResourceUtilizationTab } from '../components/ResourceUtilizationTab';
import { AllocationPlanTab } from '../components/AllocationPlanTab';
//import { PatientFlowTab } from '../components/PatientFlowTab';
import { useResourceAllocation } from '../hooks/useResourceAllocation';

export const ManageResourceAllocation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('resource-utilization');
  const managerID = 'PAT-202510-0001';

  const {
    loading,
    error,
    patientFlow,
    utilization,
    shortages,
    suggestions,
    staffResources,
    allocations,
    hospitals,
    fetchPatientFlow,
    fetchUtilization,
    detectShortages,
    fetchSuggestions,
    allocateResources,
    clearError
  } = useResourceAllocation(managerID);

  const handleAllocate = async (formData: any) => {
  try {
    const allocation = await allocateResources(formData);
    
    alert(`Resources allocated successfully!\n\nAllocation ID: ${allocation.allocation.allocationID}\nDepartment: ${allocation.allocation.department}\nStaff: ${allocation.allocation.staffIds.length} members\nBeds: ${allocation.allocation.bedCount}`);
    
    setActiveTab('resource-utilization');
  } catch (err) {
    console.error('Allocation failed:', err);
    alert('Failed to allocate resources. Please try again.');
  }
};

  const handleDetectShortages = async () => {
    try {
      const result = await detectShortages();
      
      if (result.hasShortages) {
        alert(`SHORTAGES DETECTED!\n\n${result.shortageCount} department(s) need attention:\n\n${result.shortages.map((s: any) => `- ${s.department}: ${s.message}`).join('\n')}`);
        await fetchSuggestions();
      } else {
        alert('No shortages detected - all departments operating normally');
      }
    } catch (err) {
      console.error('Shortage detection failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header activeTab="resources" title="Manage Resource Allocation" />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-auto">
        {error && (
          <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm text-red-800">{error}</p>
              <button onClick={clearError} className="ml-auto text-red-500">×</button>
            </div>
          </div>
        )}

        {/* {activeTab === 'patient-flow' && (
          <PatientFlowTab 
            data={patientFlow} 
            loading={loading}
            onDetectShortages={handleDetectShortages}
          />
        )} */}

        {activeTab === 'resource-utilization' && (
          <ResourceUtilizationTab 
            utilization={utilization}
            staffResources={staffResources}
            loading={loading}
            onDetectShortages={handleDetectShortages}
            shortages={shortages}
            suggestions={suggestions}
          />
        )}

        {activeTab === 'allocation-plan' && (
          <AllocationPlanTab 
            onAllocate={handleAllocate} 
            loading={loading}
            managerID={managerID}
            allocations={allocations}
            hospitals={hospitals}
            staffResources={staffResources}
          />
        )}

        {activeTab === 'reports' && (
          <div className="p-6 h-full flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg">Reports View - Coming Soon</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};