import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { CreatePrescriptionDTO, UpdatePrescriptionDTO, Prescription } from '../../types/patient.types';

interface PrescriptionFormProps {
  prescription?: Prescription;
  customUserId?: string;
  onSubmit: (data: CreatePrescriptionDTO | UpdatePrescriptionDTO) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  prescription,
  customUserId,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customUserId: customUserId || '',
    medicationName: prescription?.medicationName || '',
    dosage: prescription?.dosage || '',
    frequency: prescription?.frequency || '',
    instructions: prescription?.instructions || '',
    startDate: prescription?.startDate
      ? new Date(prescription.startDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    endDate: prescription?.endDate
      ? new Date(prescription.endDate).toISOString().split('T')[0]
      : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.medicationName.trim()) {
      setError('Medication name is required');
      return;
    }
    if (!formData.dosage.trim()) {
      setError('Dosage is required');
      return;
    }
    if (!formData.frequency.trim()) {
      setError('Frequency is required');
      return;
    }
    if (!formData.instructions.trim()) {
      setError('Instructions are required');
      return;
    }

    if (formData.endDate && formData.endDate < formData.startDate) {
      setError('End date cannot be before start date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data: any = {
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        instructions: formData.instructions,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
      };

      if (!isEdit) {
        data.customUserId = formData.customUserId;
      }

      await onSubmit(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save prescription');
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
        <Input
          label="Medication Name *"
          type="text"
          name="medicationName"
          value={formData.medicationName}
          onChange={handleChange}
          placeholder="Metformin"
          required
        />

        <Input
          label="Dosage *"
          type="text"
          name="dosage"
          value={formData.dosage}
          onChange={handleChange}
          placeholder="500mg"
          required
        />

        <Input
          label="Frequency *"
          type="text"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          placeholder="Twice daily"
          required
        />

        <Input
          label="Start Date *"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />

        <Input
          label="End Date (Optional)"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructions *
        </label>
        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          rows={4}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="Take with meals. Monitor blood sugar levels..."
        />
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Prescription' : 'Add Prescription'}
        </Button>
      </div>
    </form>
  );
};