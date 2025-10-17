import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { CreateDiagnosisDTO, UpdateDiagnosisDTO, Diagnosis } from '../../types/patient.types';

interface DiagnosisFormProps {
  diagnosis?: Diagnosis;
  customUserId?: string;
  onSubmit: (data: CreateDiagnosisDTO | UpdateDiagnosisDTO) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export const DiagnosisForm: React.FC<DiagnosisFormProps> = ({
  diagnosis,
  customUserId,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customUserId: customUserId || '',
    description: diagnosis?.description || '',
    diagnosisDate: diagnosis?.diagnosisDate 
      ? new Date(diagnosis.diagnosisDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await onSubmit({
          description: formData.description,
          diagnosisDate: formData.diagnosisDate,
        });
      } else {
        await onSubmit({
          customUserId: formData.customUserId,
          description: formData.description,
          diagnosisDate: formData.diagnosisDate,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save diagnosis');
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="Enter diagnosis description..."
        />
      </div>

      <Input
        label="Diagnosis Date"
        type="date"
        name="diagnosisDate"
        value={formData.diagnosisDate}
        onChange={handleChange}
        required
      />

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Diagnosis' : 'Add Diagnosis'}
        </Button>
      </div>
    </form>
  );
};