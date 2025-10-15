import React, { useState } from 'react';

interface CreateAllocationFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  hospitals: any[];
  staffResources: any[];
}

export const CreateAllocationForm: React.FC<CreateAllocationFormProps> = ({ 
  onSubmit, 
  loading,
  hospitals,
  staffResources
}) => {
  const [formData, setFormData] = useState({
    department: 'ICU',
    shift: 'Day Shift (7AM - 7PM)',
    staffIds: [] as string[],
    bedCount: 10,
    equipment: ['Ventilator', 'Monitor']
  });

  // Set default hospital


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.staffIds.length === 0) {
      alert('Please select at least one staff member');
      return;
    }
    
    await onSubmit(formData);
  };

  const toggleStaff = (staffID: string) => {
    setFormData(prev => ({
      ...prev,
      staffIds: prev.staffIds.includes(staffID)
        ? prev.staffIds.filter(id => id !== staffID)
        : [...prev.staffIds, staffID]
    }));
  };

  const departmentStaff = staffResources.filter(s => s.department === formData.department);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Create Allocation Plan</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hospital Selection - Real Data */}

        {/* Department */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-4">Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value, staffIds: [] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ICU">ICU</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="GENERAL_WARD">General Ward</option>
            <option value="PEDIATRICS">Pediatrics</option>
          </select>
        </div>

        {/* Shift */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
          <select
            value={formData.shift}
            onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Day Shift (7AM - 7PM)">Day Shift (7AM - 7PM)</option>
            <option value="Night Shift (7PM - 7AM)">Night Shift (7PM - 7AM)</option>
          </select>
        </div>

        {/* Staff Selection - Real Data */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Select Staff ({formData.staffIds.length} selected)
          </h4>
          
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded p-3 space-y-2">
            {departmentStaff.length === 0 ? (
              <p className="text-sm text-gray-500">No staff available for {formData.department}</p>
            ) : (
              departmentStaff.map(staff => (
                <label key={staff.staffID} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.staffIds.includes(staff.staffID)}
                    onChange={() => toggleStaff(staff.staffID)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {staff.name} ({staff.role}) - {staff.shift}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Bed Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bed Count</label>
          <input
            type="number"
            min="0"
            value={formData.bedCount}
            onChange={(e) => setFormData({ ...formData, bedCount: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gray-800 text-white py-2.5 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Allocation'}
          </button>
        </div>
      </form>
    </div>
  );
};