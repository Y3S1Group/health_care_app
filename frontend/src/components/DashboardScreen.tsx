import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';

interface MedicalData {
  lastVisit: string;
  upcomingAppointment: string;
  recentTests: string[];
  medications: string[];
}

/**
 * UC04 Screen 2: Dashboard
 * User Action: Reviews personal health summary
 * System Response: Displays recent visits, test results, medications
 */
export const DashboardScreen: React.FC = () => {
  const [medicalData, setMedicalData] = useState<MedicalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setMedicalData({
        lastVisit: '2024-01-15',
        upcomingAppointment: '2024-02-10',
        recentTests: ['Blood Test', 'X-Ray'],
        medications: ['Aspirin 100mg', 'Vitamin D']
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* IMPORTANT: Pass both title and subtitle */}
      <Header
        activeTab="home"
        title="Your Health Dashboard"
        subtitle="Personal health summary"
      />

      {/* Add top padding to account for fixed header */}
      <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Recent Visit Card */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
            <h3 className="font-semibold text-center text-gray-900 mb-2">
              Recent Visit
            </h3>
            <p className="text-center text-gray-600">{medicalData?.lastVisit}</p>
          </Card>

          {/* Appointment Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                </svg>
              </div>
            </div>
            <h3 className="font-semibold text-center text-gray-900 mb-2">
              Next Appointment
            </h3>
            <p className="text-center text-gray-600">
              {medicalData?.upcomingAppointment}
            </p>
          </Card>

          {/* Test Results Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                </svg>
              </div>
            </div>
            <h3 className="font-semibold text-center text-gray-900 mb-2">
              Test Results
            </h3>
            <p className="text-center text-gray-600">
              {medicalData?.recentTests.length} Recent
            </p>
          </Card>
        </div>

        {/* Medical Records Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Recent Tests</h3>
            <ul className="space-y-2">
              {medicalData?.recentTests.map((test, idx) => (
                <li key={idx} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  {test}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">
              Current Medications
            </h3>
            <ul className="space-y-2">
              {medicalData?.medications.map((med, idx) => (
                <li key={idx} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  {med}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            variant="secondary"
            onClick={() => alert('View full medical records')}
          >
            View Full Records
          </Button>
          <Button
            variant="primary"
            onClick={() => (window.location.href = '/book-appointment')}
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};