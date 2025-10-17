import React from 'react';
import { Card } from '../common/Card';
import type { PatientProfile } from '../../types/patient.types';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface PatientProfileViewProps {
  profile: PatientProfile;
}

// Helper function: returns an empty string if value is undefined or null
const safeValue = (value?: string | number | null) => (value ?? '');

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Vitals */}
      <Card title="Vitals">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Temperature</p>
            <p className="text-lg font-semibold text-gray-900">
              {profile.temperature ? `${profile.temperature}°C` : ''}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Blood Pressure</p>
            <p className="text-lg font-semibold text-gray-900">
              {safeValue(profile.bloodPressure)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Heart Rate</p>
            <p className="text-lg font-semibold text-gray-900">
              {profile.heartRate ? `${profile.heartRate} bpm` : ''}
            </p>
          </div>
        </div>
      </Card>

      {/* Billing */}
      <Card title="Billing Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Charges</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(profile.totalCharges)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Paid Amount</p>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(profile.paidAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Outstanding</p>
            <p className="text-lg font-semibold text-red-600">
              {formatCurrency(profile.outstanding)}
            </p>
          </div>
        </div>
      </Card>

      {/* Insurance */}
      <Card title="Insurance Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Provider</p>
            <p className="text-lg font-semibold text-gray-900">
              {safeValue(profile.insuranceProvider)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Policy Number</p>
            <p className="text-lg font-semibold text-gray-900">
              {safeValue(profile.policyNumber)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Group Number</p>
            <p className="text-lg font-semibold text-gray-900">
              {safeValue(profile.groupNumber)}
            </p>
          </div>
        </div>
      </Card>

      {/* Discharge */}
      {profile.dischargeDate && (
        <Card title="Discharge Information">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Discharge Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(profile.dischargeDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Attending Physician</p>
                <p className="text-lg font-semibold text-gray-900">
                  {safeValue(profile.attendingPhysician)}
                </p>
              </div>
            </div>
            {profile.dischargeSummary && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Discharge Summary</p>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                  {safeValue(profile.dischargeSummary)}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
