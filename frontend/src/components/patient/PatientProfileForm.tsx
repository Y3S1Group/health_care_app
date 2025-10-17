import React, { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { PatientProfile, CreatePatientProfileDTO, UpdatePatientProfileDTO } from '../../types/patient.types';

interface PatientProfileFormProps {
  profile?: PatientProfile;
  customUserId?: string;
  onSubmit: (data: CreatePatientProfileDTO | UpdatePatientProfileDTO) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export const PatientProfileForm: React.FC<PatientProfileFormProps> = ({
  profile,
  customUserId,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    userId: customUserId || '',
    temperature: profile?.temperature?.toString() || '',
    bloodPressure: profile?.bloodPressure || '',
    heartRate: profile?.heartRate?.toString() || '',
    totalCharges: profile?.totalCharges?.toString() || '',
    paidAmount: profile?.paidAmount?.toString() || '',
    insuranceProvider: profile?.insuranceProvider || '',
    policyNumber: profile?.policyNumber || '',
    groupNumber: profile?.groupNumber || '',
    attendingPhysician: profile?.attendingPhysician || '',
    dischargeDate: profile?.dischargeDate ? profile.dischargeDate.split('T')[0] : '',
    dischargeSummary: profile?.dischargeSummary || '',
  });

  const [errors, setErrors] = useState({
    userId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors = {
      userId: '',
    };

    if (!isEdit && !formData.userId.trim()) {
      newErrors.userId = 'Patient ID is required';
      setErrors(newErrors);
      return false;
    }

    // Validate Patient ID format (e.g., PAT-202510-0001)
    if (!isEdit && !/^PAT-\d{6}-\d{4}$/.test(formData.userId.trim())) {
      newErrors.userId = 'Patient ID must be in format: PAT-YYYYMM-XXXX (e.g., PAT-202510-0001)';
      setErrors(newErrors);
      return false;
    }

    setErrors(newErrors);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const data: any = {
        userId: formData.userId.trim(),
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        bloodPressure: formData.bloodPressure || undefined,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
        totalCharges: formData.totalCharges ? parseFloat(formData.totalCharges) : undefined,
        paidAmount: formData.paidAmount ? parseFloat(formData.paidAmount) : undefined,
        insuranceProvider: formData.insuranceProvider || undefined,
        policyNumber: formData.policyNumber || undefined,
        groupNumber: formData.groupNumber || undefined,
        attendingPhysician: formData.attendingPhysician || undefined,
        dischargeDate: formData.dischargeDate || undefined,
        dischargeSummary: formData.dischargeSummary || undefined,
      };

      // Remove userId for edit
      if (isEdit) {
        delete data.userId;
      }

      await onSubmit(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient ID Section - Only show when creating new profile */}
        {!isEdit && (
          <div className="col-span-2">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h4>
            <Input
              label="Patient ID"
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              error={errors.userId}
              placeholder="PAT-202510-0001"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: PAT-YYYYMM-XXXX (e.g., PAT-202510-0001)
            </p>
          </div>
        )}

        {/* Vitals Section */}
        <div className="col-span-2">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Vitals</h4>
        </div>

        <Input
          label="Temperature (°C)"
          type="number"
          step="0.1"
          name="temperature"
          value={formData.temperature}
          onChange={handleChange}
          placeholder="37.5"
        />

        <Input
          label="Blood Pressure"
          type="text"
          name="bloodPressure"
          value={formData.bloodPressure}
          onChange={handleChange}
          placeholder="120/80"
        />

        <Input
          label="Heart Rate (bpm)"
          type="number"
          name="heartRate"
          value={formData.heartRate}
          onChange={handleChange}
          placeholder="72"
        />

        {/* Billing Section */}
        <div className="col-span-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Billing</h4>
        </div>

        <Input
          label="Total Charges ($)"
          type="number"
          step="0.01"
          name="totalCharges"
          value={formData.totalCharges}
          onChange={handleChange}
          placeholder="5000.00"
        />

        <Input
          label="Paid Amount ($)"
          type="number"
          step="0.01"
          name="paidAmount"
          value={formData.paidAmount}
          onChange={handleChange}
          placeholder="2000.00"
        />

        {/* Insurance Section */}
        <div className="col-span-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Insurance</h4>
        </div>

        <Input
          label="Insurance Provider"
          type="text"
          name="insuranceProvider"
          value={formData.insuranceProvider}
          onChange={handleChange}
          placeholder="Blue Cross"
        />

        <Input
          label="Policy Number"
          type="text"
          name="policyNumber"
          value={formData.policyNumber}
          onChange={handleChange}
          placeholder="BC123456"
        />

        <Input
          label="Group Number"
          type="text"
          name="groupNumber"
          value={formData.groupNumber}
          onChange={handleChange}
          placeholder="GRP001"
        />

        <Input
          label="Attending Physician"
          type="text"
          name="attendingPhysician"
          value={formData.attendingPhysician}
          onChange={handleChange}
          placeholder="Dr. Smith"
        />

        {/* Discharge Section - Only show when editing */}
        {isEdit && (
          <>
            <div className="col-span-2 mt-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Discharge</h4>
            </div>

            <Input
              label="Discharge Date"
              type="date"
              name="dischargeDate"
              value={formData.dischargeDate}
              onChange={handleChange}
            />

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discharge Summary
              </label>
              <textarea
                name="dischargeSummary"
                value={formData.dischargeSummary}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Patient summary and discharge instructions..."
              />
            </div>
          </>
        )}
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Profile' : 'Create Profile'}
        </Button>
      </div>
    </form>
  );
};